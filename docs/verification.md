# 实际检查结果与未完成事项

检查时间：2026-10-02（本地开发环境 macOS，Node 23，Chrome 内核浏览器）

## 已实际验证（通过）

| 检查项 | 结果 |
| --- | --- |
| 生产构建 `npm run build` | 通过，0 错误（dist 含 index.html、assets、data/） |
| 代码检查 `npm run lint` | 通过，0 警告 0 错误 |
| 首页渲染（站名/简介/搜索框/分类/编辑精选/卡片） | 通过，20 张卡片正常展示 |
| 搜索（名称/简介/作者/标签，忽略大小写与空格） | 通过，"pdf"→1 条，"superpowers"→6 条 |
| 搜索 + 分类组合、匹配数量、清除条件、空结果提示 | 通过 |
| 排行页三个榜单与免责声明 | 通过；Stars/最近更新按仓库去重，第一名 obra/superpowers（约 294k） |
| 仓库行展开查看已收录 Skill | 通过（展开 obra/superpowers 显示 6 条链接） |
| 详情页全部区块（用途/示例/人群/工具/安装/许可证/日期/来源链接） | 通过 |
| 命令复制按钮 | 通过，点击后显示"已复制 ✓"反馈 |
| 页脚"GitHub 数据最后成功同步时间" | 通过，显示 2026 年 10 月 2 日 |
| 同步脚本成功路径 `npm run sync` | 通过，3/3 仓库成功更新（指标变化时刷新 fetchedAt） |
| 同步脚本限流失败路径 | 通过（实测限流时保留旧数据、记录原因、lastSuccessAt 不变） |
| 控制台报错 | 无（仅 React DevTools 提示） |

## 部分验证（受环境限制）

| 检查项 | 状态 |
| --- | --- |
| 手机端 375px 布局 | CSS 断点已确认（≤640px 卡片单列、页头换行、代码区独立横向滚动、正文无整体横向滚动）；受测试环境限制未做窄视口截图，建议上线前用手机真机或浏览器设备模拟再确认一次 |

## 未完成事项（上线前）

1. **推送到 GitHub 仓库**：仓库名确定后，`.github/workflows/sync.yml` 自动生效（每天 00:10 UTC 同步）。
2. **部署平台二选一**：GitHub Pages / Cloudflare Pages / Vercel，均为静态托管，`base: './'` 已兼容子目录。
3. **手机真机过一遍页面**（见上表）。
4. **扩充收录**：按 `docs/candidates.md` 的核实步骤继续收录，优先补充"设计创作"分类（目前为空）。
5. 可选：域名与站点名称最终确认（当前为暂定名「Skill 灵感站」）。

---

## 第二轮精细检查（2026-10-02）

### 发现并修复的问题

| # | 问题 | 修复 |
| --- | --- | --- |
| 1 | repos.json 缺失 obra/superpowers 条目，6 个 Skill 的 Stars 显示"—"、Stars 榜沉底，而 meta.json 却标 status ok | 已用 GitHub API 实测数据补齐（★293493 / Forks 26255 / 推送 2026-09-27 / MIT） |
| 2 | 路由切换后滚动位置不复位（首页底部点进详情页从中部显示） | App.tsx 新增 ScrollToTop，pathname 变化时回到顶部 |
| 3 | WebKit 下搜索框同时出现原生与自定义两个清除按钮 | CSS 隐藏 `::-webkit-search-cancel-button` / `-search-decoration` |
| 4 | 排行页 tabs 用了 role=tablist 但无方向键导航 | 新增 ←/→ 循环切换、Home/End 跳首尾、roving tabindex |
| 5 | 复制按钮高度约 26px，移动端难点中 | padding 调整为 7px 14px（约 31px 高） |
| 6 | 同步脚本不校验 API 响应字段，缺字段会被当成功写入并刷新 fetchedAt | fetchRepo 增加 stars/forks/pushedAt 类型校验，异常按失败处理并保留旧数据 |

### 代码级复核通过（未改动）

搜索（中英文/大小写/前后空格/与分类组合/计数准确性/空态提示/清除后恢复全量）、Stars 按数值排序（非文本）、合集仓库共用数据与榜单去重、复制按钮完整命令与成败双反馈、同步脚本同仓库去重请求/限流保留旧数据/lastSuccessAt 语义/令牌不进前端产物、≤640px 断点 CSS（单列卡片、长命令仅代码区横向滚动）、:focus-visible 键盘焦点可见。

---

## 第三轮：上线前检查（2026-10-02，部署准备）

| 检查项 | 结果 | 方式 |
| --- | --- | --- |
| 生产构建 `npm run build` | 通过，dist 共 7 个文件（index.html、CSS/JS、data/*.json、favicon.svg） | 本机实测 |
| lint | 通过，0 警告 0 错误 | 本机实测 |
| 第二轮遗留的排行页键盘导航修改 | 已补应用（←/→/Home/End，roving tabindex） | 代码修改 |
| 资源路径 | 全部相对路径（./assets、./data、./favicon.svg），适配 `用户名.github.io/<仓库名>/` 子目录 | 产物检查 |
| 详情地址直接打开/刷新 | HashRouter 下所有路由命中根 index.html，无需额外托管回退配置 | 架构判断 |
| 分享信息 | 已补 og:title / og:description / og:type / og:site_name（og:image 列为可选待办） | 代码修改 |
| 公开列表数据真实性 | 20 个 Skill 均有 SKILL.md 核实记录；repos.json 3 个仓库均为 API 实测值；无演示/占位数据 | 数据核对 |
| 密钥与私人文件 | 无 ghp_/github_pat_ 令牌、无 .env/凭证文件；GITHUB_TOKEN 仅存在于 Actions 环境变量 | 全项目扫描 |
| 部署工作流 | deploy.yml（push 自动 + 手动触发）与 sync.yml（数据变化后构建部署）已就位；GITHUB_TOKEN 提交不触发其他工作流，无循环风险 | 代码检查 |
| 时区 | sync.yml 定时 00:10 UTC = 北京时间 08:10（GitHub 定时任务可能延迟几分钟到半小时） | 配置核对 |

**仍未验证（需部署后进行）**：线上访问、手机真机、Actions 实际运行一次。详见 [maintenance.md](maintenance.md) 待办表。

---

## 第四轮：部署实测（2026-10-02）

| 检查项 | 结果 |
| --- | --- |
| 远程仓库创建（dalaoshi245/skill-spark，公开）+ Pages Source 设为 GitHub Actions | 完成（浏览器实测） |
| 推送 main 分支 | 完成（HTTPS 旧凭证失效，改用 SSH 密钥；本机生成 ed25519 密钥并添加到 GitHub） |
| 首次自动部署（push 触发 deploy.yml） | 成功，run 36982460938 |
| 公开网址 `https://dalaoshi245.github.io/skill-spark/` | HTTP 200，标题与 og 标签正确 |
| 线上数据与资源 | skills.json / repos.json / meta.json / favicon / JS / CSS 全部 200 |
| 手动触发同步工作流（Run workflow） | 成功，run 36982834959；产生提交 "chore(data): 同步 GitHub 仓库指标" 并自动重新部署 |
| 数据→部署→页面衔接 | 线上 meta.json 的 lastSuccessAt 已更新为 2026-10-02T08:13:47Z，repos.json 3 个仓库在位 |

**待人工确认**：手机或另一浏览器访问线上网址，检查首页/搜索/分类/排行/详情与复制按钮（未验证前不标记为通过）。
