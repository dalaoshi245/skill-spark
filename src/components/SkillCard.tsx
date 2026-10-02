import { Link } from 'react-router-dom'
import { CATEGORY_LABELS } from '../data'
import type { RepoMetrics, Skill } from '../types'
import { formatCount } from '../utils'

export default function SkillCard({
  skill,
  metrics,
}: {
  skill: Skill
  metrics: RepoMetrics | undefined
}) {
  return (
    <Link to={`/skill/${skill.id}`} className="card">
      <div className="card-top">
        <h3 className="card-name">{skill.name}</h3>
        <span className="cat-tag">{CATEGORY_LABELS[skill.category]}</span>
      </div>
      <p className="card-summary">{skill.summary}</p>
      <div className="card-meta">
        <span className="card-tools" title={skill.tools.join('、')}>
          适用：{skill.tools.slice(0, 2).join('、')}
          {skill.tools.length > 2 ? ' 等' : ''}
        </span>
        <span className="stars" title="所属仓库 Stars，不代表单个 Skill 的使用量">
          <span className="star-icon" aria-hidden="true">★</span> {formatCount(metrics?.stars)}
          <span className="stars-label">仓库 Stars</span>
        </span>
      </div>
    </Link>
  )
}
