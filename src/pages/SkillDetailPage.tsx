import { Link, useParams } from 'react-router-dom'
import CopyButton from '../components/CopyButton'
import { CATEGORY_LABELS, useSite } from '../data'
import { formatCount, formatDate } from '../utils'

export default function SkillDetailPage() {
  const { id } = useParams()
  const { skills, repos } = useSite()
  const skill = skills.find((s) => s.id === id)

  if (!skill) {
    return (
      <div className="container page-loading">
        没有找到这个 Skill。<Link to="/">返回首页</Link>
      </div>
    )
  }

  const metrics = repos[skill.repo]

  return (
    <div className="container">
      <div className="detail-head">
        <Link to="/" className="back-link">
          ← 返回首页
        </Link>
        <div className="detail-title">
          <h1>{skill.name}</h1>
          <span className="cat-tag">{CATEGORY_LABELS[skill.category]}</span>
        </div>
        <p className="detail-summary">{skill.summary}</p>
      </div>

      <div className="detail-grid">
        <div>
          <section className="detail-section" aria-labelledby="sec-purpose">
            <h2 id="sec-purpose">主要用途</h2>
            <ul>
              {skill.purposes.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="sec-examples">
            <h2 id="sec-examples">使用示例</h2>
            <ul>
              {skill.examples.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="sec-audience">
            <h2 id="sec-audience">适合人群</h2>
            <p>{skill.audience}</p>
          </section>

          <section className="detail-section" aria-labelledby="sec-tools">
            <h2 id="sec-tools">已核实的适用工具</h2>
            <div className="tags-row">
              {skill.tools.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <p className="install-note">
              依据：<a href={skill.toolsSourceUrl} target="_blank" rel="noreferrer">
                仓库官方文档
              </a>
            </p>
          </section>

          <section className="detail-section" aria-labelledby="sec-install">
            <h2 id="sec-install">安装指引</h2>
            {skill.installs && skill.installs.length > 0 ? (
              <>
                {skill.installs.map((g) => (
                  <div className="install-block" key={g.tool}>
                    <h3>{g.tool}</h3>
                    <ol>
                      {g.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                    {g.commands.map((c) => (
                      <div className="code-row" key={c}>
                        <code>{c}</code>
                        <CopyButton text={c} />
                      </div>
                    ))}
                    <p className="install-note">
                      <a
                        className="install-source"
                        href={g.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        来源：官方文档 ↗
                      </a>
                    </p>
                  </div>
                ))}
                <p className="install-note">
                  说明：以上步骤与命令均来自官方文档。本站只提供指引、复制与跳转，不会直接操作你的电脑；执行前请阅读来源说明。
                </p>
              </>
            ) : (
              <p>
                官方文档未提供明确的安装说明，请前往
                <a href={skill.skillDirUrl} target="_blank" rel="noreferrer">
                  技能目录
                </a>
                查看来源。
              </p>
            )}
          </section>
        </div>

        <aside>
          <div className="side-card">
            <h2>所属仓库</h2>
            <dl>
              <dt>仓库</dt>
              <dd>
                <a
                  href={`https://github.com/${skill.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {skill.repo}
                </a>
              </dd>
              <dt>作者</dt>
              <dd>{skill.author}</dd>
              <dt>Stars</dt>
              <dd>{formatCount(metrics?.stars)}</dd>
              <dt>Forks</dt>
              <dd>{formatCount(metrics?.forks)}</dd>
              <dt>最近推送</dt>
              <dd>{formatDate(metrics?.pushedAt)}</dd>
              <dt>归档状态</dt>
              <dd>{metrics ? (metrics.archived ? '已归档（只读）' : '未归档') : '未知'}</dd>
            </dl>
            <p className="side-note">
              仓库指标与同一合集内的其他 Skill 共用；Stars 不代表单个 Skill 的使用量。
            </p>
          </div>

          <div className="side-card">
            <h2>许可证与日期</h2>
            <dl>
              <dt>许可证</dt>
              <dd>
                {skill.licenseUrl ? (
                  <a href={skill.licenseUrl} target="_blank" rel="noreferrer">
                    {skill.license}
                  </a>
                ) : (
                  skill.license
                )}
              </dd>
              <dt>收录日期</dt>
              <dd>{formatDate(skill.addedAt)}</dd>
              <dt>内容核实</dt>
              <dd>{formatDate(skill.verifiedAt)}</dd>
              <dt>数据同步</dt>
              <dd>{metrics ? formatDate(metrics.fetchedAt) : '未知'}</dd>
            </dl>
          </div>

          <div className="side-card">
            <h2>来源链接</h2>
            <ul className="source-list">
              <li>
                <a href={skill.skillDirUrl} target="_blank" rel="noreferrer">
                  技能目录（GitHub）↗
                </a>
              </li>
              <li>
                <a href={skill.skillMdUrl} target="_blank" rel="noreferrer">
                  SKILL.md 原文 ↗
                </a>
              </li>
              <li>
                <a
                  href={`https://github.com/${skill.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  所属仓库 ↗
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
