#!/usr/bin/env node
/**
 * GitHub 仓库数据同步脚本
 *
 * 读取 public/data/skills.json 中出现的全部仓库（同一仓库只请求一次），
 * 通过 GitHub 官方 API 更新 public/data/repos.json 与 public/data/meta.json。
 *
 * 规则：
 * - 令牌只从环境变量 GITHUB_TOKEN 读取（可选；未认证限流 60 次/小时）。
 * - 某个仓库请求失败/被限流时，保留该仓库上一次成功数据，并在 meta.errors 记录原因。
 * - 指标没有变化时保留原记录（含原 fetchedAt），避免无意义的时间戳变更。
 * - 仅当全部仓库都成功时才刷新 meta.lastSuccessAt；失败时不把旧数据标成刚更新。
 *
 * 手动运行：node scripts/sync-github.mjs   （或 npm run sync）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(root, 'public', 'data');
const SKILLS_FILE = join(DATA_DIR, 'skills.json');
const REPOS_FILE = join(DATA_DIR, 'repos.json');
const META_FILE = join(DATA_DIR, 'meta.json');

const token = process.env.GITHUB_TOKEN;
const headers = {
  'User-Agent': 'skill-spark-sync',
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function fetchRepo(fullName) {
  const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    const reset = res.headers.get('x-ratelimit-reset');
    let reason = `HTTP ${res.status}`;
    if ((res.status === 403 || res.status === 429) && remaining === '0') {
      const resetAt = reset ? new Date(Number(reset) * 1000).toISOString() : '未知';
      reason = `触发 GitHub API 限流（重置时间 ${resetAt}）`;
    } else if (res.status === 404) {
      reason = '仓库不存在或无权访问（404）';
    }
    throw new Error(reason);
  }
  const data = await res.json();
  // 字段不完整视为失败，避免把缺字段的响应当成功写入（JSON 会丢键且刷新 fetchedAt）
  if (
    typeof data.stargazers_count !== 'number' ||
    typeof data.forks_count !== 'number' ||
    typeof data.pushed_at !== 'string'
  ) {
    throw new Error('API 响应缺少必要字段（stars/forks/pushedAt），已按失败处理');
  }
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    pushedAt: data.pushed_at,
    archived: Boolean(data.archived),
    license: data.license?.spdx_id && data.license.spdx_id !== 'NOASSERTION' ? data.license.spdx_id : null,
  };
}

async function main() {
  const skills = readJson(SKILLS_FILE, null);
  if (!Array.isArray(skills)) {
    console.error(`无法读取 ${SKILLS_FILE}`);
    process.exit(1);
  }
  const repoNames = [...new Set(skills.map((s) => s.repo))];
  const prevRepos = readJson(REPOS_FILE, {});
  const prevMeta = readJson(META_FILE, {});

  console.log(`共 ${repoNames.length} 个仓库需要同步${token ? '（已使用令牌）' : '（未设置 GITHUB_TOKEN，限流 60 次/小时）'}`);

  const now = new Date().toISOString();
  const nextRepos = {};
  const errors = [];
  let changedCount = 0;

  for (const name of repoNames) {
    const prev = prevRepos[name];
    try {
      const fresh = await fetchRepo(name);
      const unchanged =
        prev &&
        prev.stars === fresh.stars &&
        prev.forks === fresh.forks &&
        prev.pushedAt === fresh.pushedAt &&
        prev.archived === fresh.archived &&
        prev.license === fresh.license;
      // 指标无变化则整条保留（含原 fetchedAt），有变化才更新获取时间
      nextRepos[name] = unchanged ? prev : { ...fresh, fetchedAt: now };
      if (!unchanged) changedCount += 1;
      console.log(`✓ ${name}: ★${fresh.stars}${unchanged ? '（无变化）' : '（已更新）'}`);
    } catch (err) {
      errors.push({ repo: name, reason: err.message, at: now });
      if (prev) {
        nextRepos[name] = prev; // 保留上一次成功数据
        console.warn(`✗ ${name}: ${err.message} —— 保留上次数据`);
      } else {
        console.warn(`✗ ${name}: ${err.message} —— 无历史数据，本次跳过`);
      }
    }
  }

  const allOk = errors.length === 0;
  const meta = {
    lastRunAt: now,
    // 只有全部成功才刷新“最后成功时间”；失败时保留旧值，不把旧数据标成刚更新
    lastSuccessAt: allOk ? now : (prevMeta.lastSuccessAt ?? null),
    status: allOk ? 'ok' : Object.keys(nextRepos).length > 0 ? 'partial' : 'failed',
    errors,
  };

  mkdirSync(DATA_DIR, { recursive: true });
  const reposJson = JSON.stringify(nextRepos, null, 2) + '\n';
  const metaJson = JSON.stringify(meta, null, 2) + '\n';
  const prevReposRaw = existsSync(REPOS_FILE) ? readFileSync(REPOS_FILE, 'utf8') : '';
  const prevMetaRaw = existsSync(META_FILE) ? readFileSync(META_FILE, 'utf8') : '';

  if (reposJson !== prevReposRaw) writeFileSync(REPOS_FILE, reposJson);
  if (metaJson !== prevMetaRaw) writeFileSync(META_FILE, metaJson);

  console.log(
    `完成：${repoNames.length - errors.length}/${repoNames.length} 成功，${changedCount} 个仓库指标有变化，状态 ${meta.status}`
  );
  // 全部失败时以非零退出，便于 CI 告警；部分成功视为成功（已保留旧数据）
  if (meta.status === 'failed') process.exit(1);
}

main().catch((err) => {
  console.error('同步脚本异常终止：', err);
  process.exit(1);
});
