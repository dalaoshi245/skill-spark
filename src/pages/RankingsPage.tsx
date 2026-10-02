import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_LABELS, useSite } from '../data'
import { formatCount, formatDate } from '../utils'

type Tab = 'stars' | 'updated' | 'added'

const TABS: { id: Tab; label: string }[] = [
  { id: 'stars', label: 'Stars 榜' },
  { id: 'updated', label: '最近更新' },
  { id: 'added', label: '新收录' },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`chev${open ? ' open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function RankingsPage() {
  const { skills, repos } = useSite()
  const [tab, setTab] = useState<Tab>('stars')
  const [openRepo, setOpenRepo] = useState<string | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  /** tabs 键盘导航：←/→ 循环切换，Home/End 跳首尾 */
  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = TABS.length
    let next: number
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      next = (index + (e.key === 'ArrowRight' ? 1 : -1) + count) % count
    } else if (e.key === 'Home') {
      next = 0
    } else if (e.key === 'End') {
      next = count - 1
    } else {
      return
    }
    e.preventDefault()
    setTab(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  /** 以仓库为单位聚合（同一合集内多个 Skill 共用仓库数据，榜单按仓库去重） */
  const repoRows = useMemo(() => {
    const groups = new Map<string, typeof skills>()
    for (const s of skills) {
      const list = groups.get(s.repo) ?? []
      list.push(s)
      groups.set(s.repo, list)
    }
    const rows = [...groups.entries()].map(([repo, list]) => ({
      repo,
      list,
      metrics: repos[repo],
    }))
    if (tab === 'stars') {
      rows.sort((a, b) => (b.metrics?.stars ?? -1) - (a.metrics?.stars ?? -1))
    } else {
      rows.sort((a, b) =>
        (b.metrics?.pushedAt ?? '').localeCompare(a.metrics?.pushedAt ?? ''),
      )
    }
    return rows
  }, [skills, repos, tab])

  const addedRows = useMemo(
    () => [...skills].sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
    [skills],
  )

  return (
    <div className="container">
      <section className="section">
        <h1 className="section-title" style={{ fontSize: 28 }}>
          排行
        </h1>

        <p className="disclaimer" role="note">
          排行基于本站已收录的 {skills.length} 个 Skill（来自 {repoRows.length} 个仓库），不代表
          GitHub 全量排名。Stars 为<strong>所属仓库</strong>指标，同一合集内多个 Skill 共用，不代表单个
          Skill 的使用量或评分。
        </p>

        <div className="tabs" role="tablist" aria-label="排行方式">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              tabIndex={tab === t.id ? 0 : -1}
              className="tab"
              onKeyDown={(e) => onTabKeyDown(e, i)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'added' ? (
          <ol className="rank-list">
            {addedRows.map((s) => (
              <li key={s.id} className="repo-row">
                <Link to={`/skill/${s.id}`} className="repo-main">
                  <span className="repo-info">
                    <span className="repo-name">
                      {s.name}
                      <span className="cat-tag">{CATEGORY_LABELS[s.category]}</span>
                    </span>
                    <span className="repo-metrics">
                      {s.repo} · ★ {formatCount(repos[s.repo]?.stars)}（仓库）
                    </span>
                  </span>
                  <span className="added-date">收录于 {formatDate(s.addedAt)}</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="rank-list">
            {repoRows.map((row, i) => {
              const open = openRepo === row.repo
              return (
                <li key={row.repo} className="repo-row">
                  <button
                    type="button"
                    className="repo-main"
                    aria-expanded={open}
                    onClick={() => setOpenRepo(open ? null : row.repo)}
                  >
                    <span className="rank-no">{i + 1}</span>
                    <span className="repo-info">
                      <span className="repo-name">
                        {row.repo}
                        {row.metrics?.archived && (
                          <span className="archived-badge">已归档</span>
                        )}
                      </span>
                      <span className="repo-metrics">
                        <span>★ {formatCount(row.metrics?.stars)} Stars</span>
                        <span>Forks {formatCount(row.metrics?.forks)}</span>
                        <span>最近推送 {formatDate(row.metrics?.pushedAt)}</span>
                      </span>
                    </span>
                    <span className="repo-count">
                      已收录 {row.list.length} 个 Skill
                    </span>
                    <Chevron open={open} />
                  </button>
                  {open && (
                    <ul className="repo-skills">
                      {row.list.map((s) => (
                        <li key={s.id}>
                          <Link to={`/skill/${s.id}`}>
                            {s.name}
                            <span className="skill-line-summary"> — {s.summary}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}
