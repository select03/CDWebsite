/**
 * 全域靜態資產死鎖常數 (Global Static Asset Deadlock Constants)
 * 嚴格固定品牌 Logo、個人大頭照與作品集預設縮圖之靜態路徑
 * 確保不被任何動態 API / KV / content.json 覆蓋，避免破圖
 */
export const STATIC_ASSETS = {
  /** 品牌 Logo 向量圖檔 */
  LOGO: '/images/logo.svg',
  /** 個人大頭照 Avatar (預設連結至 avatar.jpeg，支援 jpeg/jpg/png/webp) */
  AVATAR: '/images/avatar.jpeg',
  /** 作品集預設縮圖與 Fallback 封面圖 (Portfolio Thumbnail) */
  PORTFOLIO_FALLBACK_THUMBNAIL: '/images/shell.png',
} as const;

export const AVATAR_FALLBACK_CANDIDATES = [
  '/images/avatar.jpeg',
  '/images/avatar.jpg',
  '/images/avatar.png',
  '/images/avatar.webp'
] as const;

export const BRAND_LOGO_SRC = STATIC_ASSETS.LOGO;
export const FOUNDER_AVATAR_SRC = STATIC_ASSETS.AVATAR;
export const DEFAULT_PORTFOLIO_IMAGE = STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL;
