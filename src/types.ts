export type CategoryId = 'dev' | 'design' | 'writing' | 'data' | 'efficiency';

export interface InstallGuide {
  tool: string;
  steps: string[];
  commands: string[];
  sourceUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  /** 中文简介（依据原始说明归纳） */
  summary: string;
  /** 主要用途 */
  purposes: string[];
  /** 使用示例 */
  examples: string[];
  /** 适合人群 */
  audience: string;
  category: CategoryId;
  tags: string[];
  /** 已核实的适用工具 */
  tools: string[];
  toolsSourceUrl: string;
  /** 所属仓库 owner/name */
  repo: string;
  author: string;
  skillDir: string;
  skillDirUrl: string;
  skillMdUrl: string;
  license: string;
  licenseUrl?: string;
  /** 按工具区分的官方安装指引；官方未提供时为 null */
  installs: InstallGuide[] | null;
  featured: boolean;
  /** 本站收录日期 YYYY-MM-DD */
  addedAt: string;
  /** 内容核实日期 YYYY-MM-DD */
  verifiedAt: string;
}

export interface RepoMetrics {
  stars: number;
  forks: number;
  pushedAt: string;
  archived: boolean;
  license: string | null;
  fetchedAt: string;
}

export interface SyncMeta {
  lastRunAt: string;
  lastSuccessAt: string | null;
  status: 'ok' | 'partial' | 'failed';
  errors: { repo: string; reason: string; at: string }[];
}

export interface SiteData {
  skills: Skill[];
  repos: Record<string, RepoMetrics>;
  meta: SyncMeta | null;
}
