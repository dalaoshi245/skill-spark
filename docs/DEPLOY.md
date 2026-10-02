# Skill 灵感站 — 部署与维护操作手册

面向新手的逐步说明。方案：**GitHub Pages**（免费、HTTPS、自动从 GitHub 仓库部署）。

## 方案要点

| 项目 | 说明 |
| --- | --- |
| 托管平台 | GitHub Pages（GitHub 官方静态托管） |
| 需要的账号 | 一个 GitHub 账号（免费注册即可） |
| 仓库要求 | **公开（public）仓库**——免费账号的 Pages 只支持公开仓库 |
| 费用 | 0 元（公开仓库的 Pages 和 Actions 均 free） |
| 构建命令 | `npm run build`（CI 中为 `npm ci && npm run build`） |
| 输出目录 | `dist/` |
| 环境变量 | 无需手动配置（同步用的 `GITHUB_TOKEN` 是 Actions 内置令牌，自动提供） |
| 访问地址 | `https://<你的用户名>.github.io/<仓库名>/`（仓库名决定路径） |
| 国内访问 | GitHub Pages 由 Fastly CDN 提供，国内可访问但速度不稳定且无法保证；如日后不理想可再评估迁移，先不做承诺 |

公开仓库意味着：网站代码和数据任何人可查看、克隆。本项目内容本来就全部公开（收录的都是公开仓库信息），无隐私风险。

## 首次部署（约 10 分钟）

### 第 1 步：在 GitHub 网页创建仓库

1. 登录 [github.com](https://github.com)，点右上角 **+** → **New repository**；
2. Repository name 填 `skill-spark`（想用其他名字也可以，访问地址会随之变化）；
3. 选择 **Public**；
4. **不要**勾选 "Add a README"（本地已有内容，勾了反而要处理冲突）；
5. 点 **Create repository**，创建后停留在显示命令提示的页面即可。

### 第 2 步：本地推送代码

在项目目录执行（把 `<你的用户名>` 替换成 GitHub 用户名）：

```bash
cd /Users/wanghongtao/Documents/skill/skill-spark
git remote add origin https://github.com/<你的用户名>/skill-spark.git
git push -u origin main
```

推送时 GitHub 会弹出登录窗口，按提示在浏览器中授权（这是 GitHub 官方的设备授权流程，不需要输入密码到终端）。

### 第 3 步：开启 GitHub Pages（一次性设置，必须做）

1. 打开仓库页面 → **Settings** → 左侧 **Pages**；
2. 在 **Build and deployment** 下，把 **Source** 从 "Deploy from a branch" 改为 **GitHub Actions**；
3. 无需保存，立即生效。

> 如果跳过这步，首次部署工作流会失败，报错为 "Get Pages site failed... must be using 'GitHub Actions'"。

### 第 4 步：确认部署成功

1. 仓库页面 → **Actions** 标签页；
2. 应看到 "部署网站到 GitHub Pages" 工作流正在运行（推送自动触发）；
3. 约 1-2 分钟后变绿 ✓，即部署成功；
4. 访问 `https://<你的用户名>.github.io/skill-spark/` 检查首页、搜索、分类、排行、详情页。

## 日常更新

| 场景 | 操作 | 触发的自动化 |
| --- | --- | --- |
| 修改网站内容/代码 | 改完后 `git add -A && git commit -m "说明" && git push` | 自动重新构建并部署（约 2 分钟） |
| 手动刷新 GitHub 数据 | 仓库 → Actions → "同步 GitHub 仓库数据" → **Run workflow** | 同步数据 → 有变化则提交并重新部署 |
| 每日自动刷新数据 | 无需操作 | 每天 UTC 00:10（**北京时间 08:10**）自动运行；GitHub 定时任务可能有几分钟延迟 |
| 手动刷新本地数据 | 本机 `npm run sync` | 只更新本地 repos.json/meta.json，记得 commit + push |

数据同步后的重新部署由 sync.yml 自己完成（GitHub 规定 GITHUB_TOKEN 的提交不触发其他工作流，这是防循环机制），所以数据更新和网站更新**两条链路都会自动部署，且不会互相触发造成循环**。

## 部署失败排查

1. 打开 **Actions** → 点进失败（红 ✗）的运行 → 点失败的步骤看红色错误日志；
2. 常见原因对照：

| 报错关键词 | 原因与处理 |
| --- | --- |
| `Get Pages site failed` / `must be using GitHub Actions` | 第 3 步没做：Settings → Pages → Source 改成 GitHub Actions，然后重跑工作流 |
| `npm ci` 失败 / `lock file` | package.json 与 package-lock.json 不同步，本地跑一次 `npm install` 后提交锁文件 |
| 同步工作流出现 `触发 GitHub API 限流` | 等限流重置后再手动 Run workflow 一次；页面数据不受影响（旧数据被保留） |
| 构建成功但页面空白/404 | 确认访问的是 `/<仓库名>/` 开头的完整地址；强刷（Cmd+Shift+R）清缓存 |

## 恢复到上一个可用版本

**方式 A（推荐，简单）**：仓库 → Actions → "部署网站到 GitHub Pages" → 找到上一次成功（绿 ✓）的运行 → 点 **Re-run all jobs**，网站立即恢复到那次部署的内容。

**方式 B（代码回退）**：本地执行 `git revert <出错提交的ID>` 然后 `git push`，推送会自动触发重新部署。

**暂停每日自动更新**：仓库 → Actions → 左侧 "同步 GitHub 仓库数据" → 右上 **⋯** → **Disable workflow**。恢复方法相同位置点 Enable。手动部署工作流（deploy.yml）不受影响，可单独保留。

## 添加新 Skill 并发布

1. 从 `docs/candidates.md` 的候选列表选一个，按其中"核实步骤"确认 SKILL.md 真实存在、安装命令来自官方文档；
2. 编辑 `public/data/skills.json`，按现有条目格式添加（id 唯一、填 verifiedAt 和 addedAt）；
3. 本地 `npm run dev` 检查新卡片、详情页、搜索是否正常；
4. `npm run sync` 顺带更新指标 → commit + push；
5. 自动部署完成后线上可见；同一仓库的新指标会在次日 08:10 自动同步。

## 网站维护清单

见 [maintenance.md](maintenance.md)（包含待核实条目、失败来源、近期变更与建议处理顺序，可直接交给 TRAE 自动化任务生成维护摘要）。
