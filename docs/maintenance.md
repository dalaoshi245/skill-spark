# 网站维护清单

> 本文件为结构化维护记录，供人工查看，也可直接交给 TRAE 自动化任务生成维护摘要。
> 最后更新：2026-10-02（部署准备完成时）

## 1. 站点状态

- 本地生产构建：✅ 通过（2026-10-02，vite 8.3.2，0 错误）
- lint：✅ 0 警告 0 错误
- 密钥扫描：✅ 通过（无 ghp_/github_pat_ 令牌、无凭证文件；GITHUB_TOKEN 仅在 Actions 环境变量中使用）
- 资源路径：✅ 全部相对路径（`./assets/`、`./data/`、`./favicon.svg`），适配子目录托管
- 分享信息：✅ title / description / og:title / og:description / og:type / og:site_name（og:image 未配置，见待办）
- SPA 刷新：✅ 使用 HashRouter，任意详情地址直接打开、刷新均命中根路径 index.html，无需服务端回退配置
- 线上部署：⏳ 待用户确认方案后执行（见 docs/DEPLOY.md）

## 2. 待核实 / 待办条目（按建议顺序）

| 优先级 | 事项 | 说明 | 状态 |
| --- | --- | --- | --- |
| 高 | 真机验证 | 部署完成后用手机或另一浏览器访问公开网址，核对首页/搜索/详情/排行 | 待办（本地 375px CSS 断点已确认） |
| 高 | 补充"设计创作"分类 | 该分类当前无收录内容，首页切到该分类会显示空态；候选见 [candidates.md](candidates.md) | 待办 |
| 中 | 手动运行一次同步工作流 | 推送仓库后到 Actions 手动触发 sync.yml，核对数据变化 → 提交 → 部署 → 页面同步时间是否衔接 | 待办（部署后） |
| 中 | 候选 Skill 逐一核实 | candidates.md 中的候选必须先核实 SKILL.md 与官方安装命令，再写入 skills.json | 持续 |
| 低 | og:image 分享图 | 未配置社交分享缩略图；如需要可生成 1200×630 图片放 `public/` 并在 index.html 加 `og:image` | 可选 |
| 低 | 自定义域名 | 当前使用 `用户名.github.io/skill-spark/`；如需自有域名再配置 | 可选 |
| 低 | 站点名称最终确认 | 当前暂定名「Skill 灵感站」，改名需同步改 index.html、App.tsx 页眉、og:site_name | 可选 |

## 3. 失败来源与排查入口

| 失败类型 | 记录位置 | 处理方法 |
| --- | --- | --- |
| GitHub 数据同步失败/限流 | `public/data/meta.json` 的 `errors` 数组；Actions 运行日志 | 页面自动保留旧数据；到 Actions 手动重跑 sync.yml |
| 同步脚本整体失败 | Actions 红色 ✗ | 看"运行同步脚本"步骤日志；限流则等重置（脚本会打印重置时间） |
| 部署失败 | Actions → "部署网站到 GitHub Pages" | 对照 DEPLOY.md"部署失败排查"表 |

核对同步状态的最快方法：看页脚"GitHub 数据最后成功同步：×年×月×日"是否与 meta.json 的 `lastSuccessAt` 一致；`status` 为 `ok` 表示当日全部仓库同步成功。

## 4. 近期变更（2026-10-02）

1. 修复 repos.json 缺失 obra/superpowers 导致 6 个 Skill Stars 显示"—"（已按 API 实测数据补齐）
2. 路由切换后回到页面顶部（App.tsx ScrollToTop）
3. 隐藏 WebKit 搜索框原生清除按钮，避免双 ✕
4. 排行页 tabs 支持方向键 / Home / End 键盘导航
5. 复制按钮加大触控区域（约 31px 高）
6. 同步脚本增加 API 响应字段校验，缺字段按失败处理并保留旧数据
7. index.html 补充 og 分享标签
8. 新增部署工作流 deploy.yml（push 自动部署 + 手动触发）；sync.yml 在数据变化后追加构建与部署步骤

## 5. 日常维护节奏

- 每日 08:10（北京时间）：自动同步 Stars/Forks/推送时间（无需人工）
- 每周建议：看一眼 Actions 是否连续成功、页脚同步时间是否新鲜
- 收录新 Skill：严格走 DEPLOY.md"添加新 Skill 并发布"流程——新发现只进 candidates.md，核实后才进 skills.json；定时任务不会自动改写安装说明，也不会执行任何仓库代码
