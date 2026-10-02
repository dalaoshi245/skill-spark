# Skill 灵感站 — 使用与部署准备说明

## 一、项目概述

- **名称**：Skill 灵感站（暂定）
- **技术栈**：React 19 + TypeScript + Vite 8，react-router-dom（HashRouter）
- **部署形态**：纯静态网站（无需后端、数据库、登录注册），可部署到 GitHub Pages / Cloudflare Pages / Vercel / 任意静态托管平台
- **数据更新**：GitHub 仓库指标通过同步脚本每日自动刷新

## 二、目录结构

```
skill-spark/
  public/
    data/
      skills.json   ← 人工整理的内容（中文简介、分类、安装说明、来源链接）
      repos.json    ← 同步脚本生成的仓库指标（Stars/Forks/最近推送/归档状态）
      meta.json     ← 同步运行状态与错误记录
    favicon.svg
  src/
    main.tsx        ← 入口
    App.tsx         ← 路由与布局（首页/排行/详情/指南）
    data.ts         ← 站点数据加载与分类定义
    types.ts        ← TypeScript 类型
    utils.ts        ← 工具函数（格式化、搜索匹配）
    components/
      SkillCard.tsx
      CopyButton.tsx
    pages/
      HomePage.tsx
      RankingsPage.tsx
      SkillDetailPage.tsx
      GuidePage.tsx
  scripts/
    sync-github.mjs ← GitHub 数据同步脚本
  .github/workflows/sync.yml ← 每日定时同步工作流
  docs/
    requirements.md ← 需求与页面结构文档
    README.md       ← 本文件
    candidates.md   ← 候选新 Skill 列表
```

## 三、如何打开本地预览

```bash
cd skill-spark
npm install       # 安装依赖（已包含 react-router-dom）
npm run dev       # 启动开发服务器，浏览器打开 http://localhost:5173
```

## 四、如何添加或修改一条 Skill

1. 编辑 `public/data/skills.json`，按现有格式追加或修改对象。字段说明详见 `src/types.ts`。
2. 在 `public/data/repos.json` 中确认 `repo` 字段对应的仓库已有记录（手动添加初始数据，后续由同步脚本自动更新指标）。
3. 运行 `npm run sync` 手动同步该仓库指标。
4. 重新执行 `npm run build` 打包。
5. 提交修改并推送到远程仓库。

> **收录原则**：只添加真实存在 SKILL.md 的仓库；中文简介依据原始说明归纳，不整段复制原文；适用工具和安装步骤必须来自官方文档，禁止拼凑命令；无安装文档时 `installs` 设为 `null`。

## 五、如何手动刷新 GitHub 数据

```bash
cd skill-spark
npm run sync
```

脚本行为：
- 自动读取 `skills.json` 中所有 `repo`，每个仓库只请求一次 API。
- 未设置 `GITHUB_TOKEN` 时，未认证限流为每小时 60 次，当前 3 个仓库绰绰有余。
- 令牌从环境变量 `GITHUB_TOKEN` 读取（可选），**从不进入前端代码或公开数据**。
- 请求失败/限流时保留上一次成功数据，在 `meta.json` 记录错误原因，不用零值覆盖。

## 六、GitHub Actions 定时同步

工作流文件：[`.github/workflows/sync.yml`](.github/workflows/sync.yml)

- 每天 00:10 UTC 自动运行。
- 使用 `secrets.GITHUB_TOKEN`（Actions 自动提供），**不需要手动配置**。
- 仅当 `repos.json` 或 `meta.json` 有变化时才会提交，避免空提交。
- 权限最小化：仅 `contents: write`。

> **待启用**：工作流已准备就绪，待你的仓库推送到 GitHub 后会自动生效（请确认仓库名与分支名匹配工作流中的路径）。

## 七、部署到 GitHub Pages 的步骤（供参考）

1. 在 GitHub 上新建仓库，把 `skill-spark` 目录推送上去（注意先编译并包含 `dist/` 中的静态文件，或使用 `gh-pages` 分支）。
2. 仓库 Settings → Pages → Build from branch → `gh-pages` / root（或 Actions 部署）。
3. 若用 `vite.config.ts` 中的 `base: './'`，可兼容子目录部署（如 `https://yourname.github.io/skill-spark/`）。
4. 部署后 GitHub Actions 定时同步即生效。

## 八、已知限制与注意事项

- 当前使用 HashRouter（`#/` 开头），无需服务端配置即可兼容静态托管。
- 若部署到根域名且需要美观 URL，可改用 BrowserRouter 并配置服务端回退规则。
- 令牌 `GITHUB_TOKEN` 仅存在于 CI/CD 运行环境，不进入前端、不写入数据文件、不公开。
