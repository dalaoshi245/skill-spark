import { createContext, useContext, useEffect, useState } from 'react';
import type { CategoryId, SiteData } from './types';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'dev', label: '编程开发' },
  { id: 'design', label: '设计创作' },
  { id: 'writing', label: '写作办公' },
  { id: 'data', label: '数据分析' },
  { id: 'efficiency', label: '效率工具' },
];

export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<
  CategoryId,
  string
>;

const base = import.meta.env.BASE_URL;
let cache: Promise<SiteData> | null = null;

function loadSiteData(): Promise<SiteData> {
  if (!cache) {
    cache = Promise.all([
      fetch(`${base}data/skills.json`).then((r) => r.json()),
      fetch(`${base}data/repos.json`).then((r) => r.json()),
      fetch(`${base}data/meta.json`).then((r) => r.json()),
    ]).then(([skills, repos, meta]) => ({ skills, repos, meta }));
  }
  return cache;
}

const SiteDataContext = createContext<SiteData | null>(null);

/** 在 Shell 中调用：加载数据并提供加载/错误状态 */
export function useSiteDataLoader() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    loadSiteData()
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);
  return { data, error, SiteDataContext };
}

/** 在页面组件中调用：读取已加载的全站数据 */
export function useSite(): SiteData {
  const data = useContext(SiteDataContext);
  if (!data) throw new Error('站点数据尚未加载');
  return data;
}
