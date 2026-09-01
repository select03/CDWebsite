/**
 * 全域靜態資產死鎖常數 (Global Static Asset Deadlock Constants)
 * 嚴格固定品牌 Logo、個人大頭照與作品集預設縮圖之 Cloudflare R2 永久 CDN 網址
 * 確保不被空值覆蓋，避免破圖或 404
 */
export const STATIC_ASSETS = {
  /** 品牌 Logo 向量圖檔 (Cloudflare R2 永久網址 Logo.svg) */
  LOGO: 'https://assets.cine-dimension.com/Logo.svg',
  /** 個人大頭照 Avatar (Cloudflare R2 永久網址) */
  AVATAR: 'https://assets.cine-dimension.com/avatar.JPG',
  /** 作品集預設縮圖與 Fallback 封面圖 (Cloudflare R2 永久網址) */
  PORTFOLIO_FALLBACK_THUMBNAIL: 'https://assets.cine-dimension.com/shell.PNG',
} as const;

export const LOGO_FALLBACK_CANDIDATES = [
  'https://assets.cine-dimension.com/Logo.svg',
  'https://assets.cine-dimension.com/logo.svg',
  'https://assets.cine-dimension.com/logo.JPG',
  'https://assets.cine-dimension.com/logo.png',
] as const;

export const AVATAR_FALLBACK_CANDIDATES = [
  'https://assets.cine-dimension.com/avatar.JPG',
  '/images/avatar.jpeg',
  '/images/avatar.jpg',
  '/images/avatar.png',
  '/images/avatar.webp'
] as const;

export const BRAND_LOGO_SRC = STATIC_ASSETS.LOGO;
export const FOUNDER_AVATAR_SRC = STATIC_ASSETS.AVATAR;
export const DEFAULT_PORTFOLIO_IMAGE = STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL;

