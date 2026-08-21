/**
 * YouTube Utility functions for extracting video IDs and high-quality thumbnails
 */

export const extractYouTubeVideoId = (url?: string): string | null => {
  if (!url) return null;
  const cleanUrl = url.trim();
  // Support youtu.be/xxx, youtube.com/watch?v=xxx, youtube.com/embed/xxx, youtube.com/v/xxx, youtube.com/shorts/xxx
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const match = cleanUrl.match(regExp);
  return match && match[1] ? match[1] : null;
};

export const getYouTubeThumbnailUrl = (url?: string, quality: 'hq' | 'maxres' | 'mq' = 'hq'): string | null => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (quality === 'mq') {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (url?: string): string | null => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
};
