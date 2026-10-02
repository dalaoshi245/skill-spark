import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SkillCard from '../components/SkillCard'
import { CATEGORIES, useSite } from '../data'
import { matchesQuery } from '../utils'

export default function HomePage() {
  const { skills, repos } = useSite()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const cat = params.get('cat') ?? 'all'

  const filtered = useMemo(
    () =>
      skills.filter(
        (s) => (cat === 'all' || s.category === cat) && matchesQuery(s, q),
      ),
    [skills, q, cat],
  )
  const featured = useMemo(() => skills.filter((s) => s.featured), [skills])
  const filtering = q.trim() !== '' || cat !== 'all'

  function update(next: { q?: string; cat?: string }) {
    const p = new URLSearchParams(params)
    if (next.q !== undefined) {
      if (next.q) p.set('q', next.q)
      else p.delete('q')
    }
    if (next.cat !== undefined) {
      if (next.cat !== 'all') p.set('cat', next.cat)
      else p.delete('cat')
    }
    setParams(p, { replace: true })
  }

  return (
    <div className="container">
      <section className="hero">
        <h1>Skill 灵感站</h1>
        <p className="tagline">
          发现 GitHub 上真实、受关注的 Agent Skill——按用途筛选，了解功能、适用工具、来源和安装方式。
        </p>

        <div className="search-box">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <label htmlFor="skill-search" className="sr-only">
            搜索 Skill
          </label>
          <input
            id="skill-search"
            type="search"
            placeholder="搜索名称、简介、作者或标签…"
            value={q}
            onChange={(e) => update({ q: e.target.value })}
          />
          {q && (
            <button
              type="button"
              className="search-clear"
              onClick={() => update({ q: '' })}
              aria-label="清空搜索"
            >
              ✕
            </button>
          )}
        </div>

        <div className="chips" role="group" aria-label="按用途分类筛选">
          <button
            type="button"
            className="chip"
            aria-pressed={cat === 'all'}
            onClick={() => update({ cat: 'all' })}
          >
            全部
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={cat === c.id}
              onClick={() => update({ cat: c.id })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {!filtering && featured.length > 0 && (
        <section className="section" aria-labelledby="featured-title">
          <h2 className="section-title" id="featured-title">
            编辑精选
          </h2>
          <p className="section-sub">文档完整、近期维护活跃、适合第一次尝试的 Skill</p>
          <div className="card-grid">
            {featured.map((s) => (
              <SkillCard key={s.id} skill={s} metrics={repos[s.repo]} />
            ))}
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="all-title">
        <h2 className="section-title" id="all-title">
          {filtering ? '筛选结果' : '全部 Skill'}
        </h2>
        <div className="result-line" role="status">
          <span>
            匹配 {filtered.length} 个{filtering ? `（共收录 ${skills.length} 个）` : ' Skill'}
          </span>
          {filtering && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => update({ q: '', cat: 'all' })}
            >
              清除条件
            </button>
          )}
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>没有找到匹配的 Skill，换个关键词或分类试试？</p>
            <button
              type="button"
              className="clear-btn"
              onClick={() => update({ q: '', cat: 'all' })}
            >
              清除全部条件
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map((s) => (
              <SkillCard key={s.id} skill={s} metrics={repos[s.repo]} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
