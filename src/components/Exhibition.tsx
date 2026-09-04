import React, { useState, useEffect } from 'react';
import { PageView, PortfolioItem } from '../types';
import { PORTFOLIO_CASES } from '../data/siteData';
import { STATIC_ASSETS } from '../constants/assets';
import { Play, ArrowRight, ExternalLink, Film, Eye, Tag, Calendar, UserCheck, Briefcase } from 'lucide-react';
import { getYouTubeThumbnailUrl } from '../utils/youtube';

interface ExhibitionProps {
  works?: PortfolioItem[];
  onNavigate?: (view: PageView) => void;
  onPlayTrailer?: () => void;
}

export const Exhibition: React.FC<ExhibitionProps> = ({ works, onNavigate, onPlayTrailer }) => {
  // 1. Dynamic state for works/portfolio, initialized with props or default cases
  const [worksList, setWorksList] = useState<PortfolioItem[]>(() => {
    if (works && Array.isArray(works) && works.length > 0) {
      return works;
    }
    return PORTFOLIO_CASES;
  });

  // 2. Fetch latest dynamic content directly from Cloudflare KV API
  useEffect(() => {
    let isMounted = true;

    async function loadDynamicContent() {
      try {
        const res = await fetch(`https://cms-api.cine-dimension.com/api/content?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        const incomingPortfolio = data?.content?.portfolio || data?.portfolio;
        if (isMounted && incomingPortfolio && Array.isArray(incomingPortfolio) && incomingPortfolio.length > 0) {
          setWorksList(incomingPortfolio);
        }
      } catch (e) {
        console.warn('動態載入作品失敗，使用預設值', e);
      }
    }

    loadDynamicContent();

    // Listen to admin CMS update events
    const handleUpdate = () => {
      loadDynamicContent();
    };
    window.addEventListener('cinedimension_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('cinedimension_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Update when prop works changes
  useEffect(() => {
    if (works && Array.isArray(works) && works.length > 0) {
      setWorksList(works);
    }
  }, [works]);

  // Sort portfolio items by year (descending: newest first)
  const sortedPortfolio: PortfolioItem[] = React.useMemo(() => {
    return [...worksList].sort((a, b) => {
      const getYear = (yStr: string) => {
        const matches = (yStr || '').match(/\d{4}/g);
        if (!matches || matches.length === 0) return 0;
        return parseInt(matches[matches.length - 1], 10);
      };
      return getYear(b.year) - getYear(a.year);
    });
  }, [worksList]);

  const handleNav = (view: PageView) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.location.hash = view;
    }
  };

  return (
    <section id="works-exhibition" className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Section Header */}
      <div className="text-center space-y-2 mb-14">
        <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase block font-semibold">
          SELECTED WORKS EXHIBITION
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif tracking-widest font-bold text-stone-900">
          代表作展覽 ｜ 影集精選實戰錄
        </h2>
        <p className="text-xs sm:text-sm font-serif text-stone-600">
          跨越商業形象、音樂錄影帶、教育講學、人文旅讀與婚禮電影
        </p>
        <div className="w-px h-8 bg-stone-300 mx-auto my-2" />
        <div className="w-2 h-2 rounded-full border border-stone-500 mx-auto" />
      </div>

      {/* Central Timeline Vertical Axis Line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-48 bottom-24 w-px bg-stone-300 hidden md:block" />

      <div className="space-y-16 sm:space-y-20 relative">
        {sortedPortfolio.map((item, index) => {
          const isEven = index % 2 === 0;
          const isHighlight = item.id === 'shell-lubricants-ad' || index === 0;

          return (
            <div
              key={item.id || `work-${index}`}
              className={`relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center transition-all duration-300 ${
                isHighlight ? 'p-6 sm:p-8 rounded-2xl bg-[#D8E2DC]/70 border border-stone-300 shadow-sm' : ''
              }`}
            >
              {/* Content Column */}
              <div
                className={`space-y-3 text-left ${
                  isEven
                    ? 'md:col-span-6 md:order-1'
                    : 'md:col-span-6 md:order-2 md:text-left'
                }`}
              >
                {/* Badges: Category & Year */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-sans tracking-widest text-stone-600 uppercase font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-stone-200/80 text-stone-800 border border-stone-300/80">
                    {item.category}
                  </span>
                  {item.year && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 text-[11px]">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      {item.year}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                  {item.title}
                </h3>

                {/* Project / Client info if available */}
                {item.clientOrProject && (
                  <p className="text-xs font-sans text-stone-600 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span><span className="font-semibold text-stone-700">專案合作：</span>{item.clientOrProject}</span>
                  </p>
                )}

                {/* Dynamic Role */}
                {item.role && (
                  <p className="text-xs font-sans text-stone-600 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span><span className="font-semibold text-stone-700">執掌角色：</span>{item.role}</span>
                  </p>
                )}

                {/* Dynamic Description text bound directly to state */}
                <p className="text-xs sm:text-sm font-serif text-stone-700 leading-relaxed pt-1">
                  {item.description}
                </p>

                {/* Dynamic Tags */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 font-sans text-[10px]">
                    {item.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-stone-200/70 border border-stone-300 text-stone-700"
                      >
                        <Tag className="w-2.5 h-2.5 text-stone-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {item.videoUrl ? (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase border border-stone-800 text-stone-900 px-3.5 py-1.5 rounded hover:bg-stone-900 hover:text-[#F6F4EE] transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>觀看作品影片</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => handleNav('portfolio')}
                      className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase bg-stone-900 text-[#F6F4EE] px-3.5 py-1.5 rounded hover:bg-stone-800 transition-all shadow-sm"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>檢視作品完整介紹</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Media Image Column */}
              <div
                className={`relative group ${
                  isEven
                    ? 'md:col-span-6 md:order-2'
                    : 'md:col-span-6 md:order-1'
                }`}
              >
                <div className="aspect-[16/10] bg-stone-200 rounded-lg overflow-hidden shadow-md relative border border-stone-300">
                  <img
                    src={item.image || getYouTubeThumbnailUrl(item.videoUrl) || STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const ytThumb = getYouTubeThumbnailUrl(item.videoUrl);
                      if (ytThumb && e.currentTarget.src !== ytThumb) {
                        e.currentTarget.src = ytThumb;
                      } else if (e.currentTarget.src !== STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL) {
                        e.currentTarget.src = STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL;
                      }
                    }}
                  />
                  {item.videoUrl ? (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 bg-stone-950/20 hover:bg-stone-950/30 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Play video"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#F6F4EE]/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-stone-900 ml-0.5" />
                      </div>
                    </a>
                  ) : (
                    <button
                      onClick={() => handleNav('portfolio')}
                      className="absolute inset-0 bg-stone-950/0 hover:bg-stone-950/20 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="View details"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#F6F4EE]/90 text-stone-900 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all group-hover:scale-105">
                        <Eye className="w-4 h-4 text-stone-900" />
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Central Timeline Node Circle */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F6F4EE] border-2 border-stone-600 hidden md:flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Works CTA */}
      <div className="text-center pt-16">
        <button
          onClick={() => handleNav('portfolio')}
          className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase border-b-2 border-stone-800 pb-1 font-semibold text-stone-900 hover:border-amber-800 hover:text-amber-800 transition-colors"
        >
          <span>VIEW ALL WORKS / 瀏覽完整作品集專區</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};

export default Exhibition;
