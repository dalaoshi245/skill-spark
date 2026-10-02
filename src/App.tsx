import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useSiteDataLoader } from './data'
import { formatDate } from './utils'
import HomePage from './pages/HomePage'
import RankingsPage from './pages/RankingsPage'
import SkillDetailPage from './pages/SkillDetailPage'
import GuidePage from './pages/GuidePage'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 8l6.2 15.3L54 29.5l-15.8 6.2L32 51l-6.2-15.3L10 29.5l15.8-6.2z"
          fill="#fff"
        />
      </svg>
    </span>
  )
}

/** HashRouter 不会自动复位滚动位置，路由切换时回到页面顶部 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { data, error, SiteDataContext } = useSiteDataLoader()

  return (
    <>
      <ScrollToTop />
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <BrandMark />
            Skill 灵感站
          </Link>
          <nav className="site-nav" aria-label="主导航">
            <NavLink to="/" end>
              首页
            </NavLink>
            <NavLink to="/rankings">排行</NavLink>
            <NavLink to="/guide">新手指南</NavLink>
          </nav>
        </div>
      </header>

      <main>
        {error ? (
          <div className="container page-loading" role="alert">
            数据加载失败。请确认 public/data/ 目录下存在 skills.json、repos.json、meta.json 后刷新重试。
          </div>
        ) : !data ? (
          <div className="container page-loading">正在加载数据…</div>
        ) : (
          <SiteDataContext.Provider value={data}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/skill/:id" element={<SkillDetailPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route
                path="*"
                element={
                  <div className="container page-loading">
                    页面不存在。<Link to="/">返回首页</Link>
                  </div>
                }
              />
            </Routes>
          </SiteDataContext.Provider>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            GitHub 数据最后成功同步：
            {data?.meta?.lastSuccessAt ? formatDate(data.meta.lastSuccessAt) : '暂无记录'}
            {data?.meta && data.meta.status !== 'ok' && '（最近一次同步未完全成功，页面展示上一次成功的数据）'}
          </p>
          <p>
            排行与 Stars 均基于本站已收录项目及其所属仓库，不代表 GitHub 全量排名，也不代表单个 Skill
            的使用量或评分。内容归纳自公开仓库并附来源链接；安装前请阅读来源说明、权限需求与许可证。
          </p>
        </div>
      </footer>
    </>
  )
}
