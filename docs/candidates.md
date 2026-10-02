# 候选待收录 Skill 列表

收录原则：候选必须实际核实（确认 SKILL.md 存在、frontmatter 完整、来源链接有效）后，才能录入 `public/data/skills.json` 公开发布。未经核实的候选不会出现在网站上。

## 已确认存在、待逐条阅读后收录

以下技能所在仓库均已核实（含 SKILL.md、近期维护中），但尚未逐条阅读全文并整理中文说明。

**obra/superpowers**（MIT，2026-09-27 仍在推送，目录 https://github.com/obra/superpowers/tree/main/skills ）：

| Skill | 链接 | 推荐收录理由 |
| --- | --- | --- |
| dispatching-parallel-agents | https://github.com/obra/superpowers/tree/main/skills/dispatching-parallel-agents | 并行派发子代理处理任务，与已收录技能互补 |
| subagent-driven-development | https://github.com/obra/superpowers/tree/main/skills/subagent-driven-development | Superpowers 方法论的核心执行方式 |
| finishing-a-development-branch | https://github.com/obra/superpowers/tree/main/skills/finishing-a-development-branch | 分支收尾流程（评审、合并），工作流闭环的一环 |
| requesting-code-review | https://github.com/obra/superpowers/tree/main/skills/requesting-code-review | 与 receiving-code-review 配套的分支评审流程 |
| receiving-code-review | https://github.com/obra/superpowers/tree/main/skills/receiving-code-review | 处理评审意见的标准流程 |
| test-driven-development | https://github.com/obra/superpowers/tree/main/skills/test-driven-development | TDD 流程（注意与 addyosmani/agent-skills 中同名技能区分来源） |
| writing-skills | https://github.com/obra/superpowers/tree/main/skills/writing-skills | 编写新 Skill 的指南，与 skill-creator 互补 |
| using-superpowers | https://github.com/obra/superpowers/tree/main/skills/using-superpowers | 元技能：教代理何时调用哪个技能 |
| diagnosing-superpowers | https://github.com/obra/superpowers/tree/main/skills/diagnosing-superpowers | 排查 Superpowers 自身问题，优先级较低 |

**anthropics/skills**（Apache-2.0 或专有，2026-09-29 仍在推送，目录 https://github.com/anthropics/skills/tree/main/skills ）：

| Skill | 链接 | 推荐收录理由 |
| --- | --- | --- |
| artifacts-builder | https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder | 官方示例技能之一，构建交互式网页构件 |
| canvas-design | https://github.com/anthropics/skills/tree/main/skills/canvas-design | 设计创作方向，可补齐该分类 |
| slack-gif-creator | https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator | 设计创作方向，轻松有趣 |
| internal-comms | https://github.com/anthropics/skills/tree/main/skills/internal-comms | 写作办公方向 |
| brand-guidelines | https://github.com/anthropics/skills/tree/main/skills/brand-guidelines | 设计创作方向 |
| theme-factory | https://github.com/anthropics/skills/tree/main/skills/theme-factory | 设计创作方向 |
| web-artifacts-builder 等其余目录 | https://github.com/anthropics/skills/tree/main/skills | 以仓库实际目录为准逐条核实 |

**addyosmani/agent-skills**（MIT，2026-10-02 仍在推送，目录 https://github.com/addyosmani/agent-skills/tree/main/skills ）：

| Skill | 链接 | 推荐收录理由 |
| --- | --- | --- |
| 其余 18 个技能目录 | https://github.com/addyosmani/agent-skills/tree/main/skills | 已收录 7 个，其余（如 accessibility、web-design-guidelines 等方向）待逐条阅读 SKILL.md 后择优收录，可补充设计创作分类 |

## 后续发现渠道

- GitHub 搜索 `filename:SKILL.md`（需认证 API，注意限流）
- GitHub 搜索 `claude skills` / `agent skills` 按 Stars 排序
- awesome 类清单仅作为寻找线索的来源：清单本身不是 Skill，不直接收录

## 核实步骤（每条候选）

1. `curl https://api.github.com/repos/<owner>/<repo>` 确认仓库存在、未归档、近期维护。
2. 用 `git/trees/HEAD?recursive=1` 找到 SKILL.md 的准确目录。
3. 阅读 SKILL.md 全文，确认功能、frontmatter 的 name/description。
4. 阅读仓库 README，确认官方安装方式（只收录原文存在的命令）。
5. 确认许可证；无许可证标注"未注明"。
6. 整理中文简介与示例（归纳而非复制原文），填写 `skills.json`，更新 `addedAt`/`verifiedAt`。
