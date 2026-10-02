import type { Skill } from './types';

/** 大数字缩写：1234 → 1.2k */
export function formatCount(n: number | undefined): string {
  if (n === undefined) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

/** ISO 时间 → 中文日期，如 2026 年 9 月 29 日 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '未知';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '未知';
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 搜索匹配：名称、中文简介、作者（仓库）、标签；忽略大小写与前后空格 */
export function matchesQuery(skill: Skill, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const haystack = [skill.name, skill.summary, skill.author, skill.repo, ...skill.tags]
    .join('\n')
    .toLowerCase();
  return haystack.includes(query);
}
