import React, { useState } from 'react';
import { useSiteData } from '../context/DataContext';
import { PortfolioItem } from '../types';
import { STATIC_ASSETS } from '../constants/assets';
import { Play, Check, X, ExternalLink, Video, Eye, Image as ImageIcon } from 'lucide-react';
import { getYouTubeThumbnailUrl, getYouTubeEmbedUrl } from '../utils/youtube';

export const PortfolioShowcase: React.FC = () => {
  const { portfolio } = useSiteData();
  const [selectedCase, setSelectedCase] = useState<PortfolioItem | null>(null);

  const sortedPortfolio = React.useMemo(() => {
    // Safety deduplication by id and title
    const seen = new Set<string>();
    const uniqueItems: PortfolioItem[] = [];

    for (const item of portfolio) {
      if (!item) continue;
      const key = (item.id || item.title || '').trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    }

    return uniqueItems.sort((a, b) => {
      const getYear = (yStr: string) => {
        const matches = (yStr || '').match(/\d{4}/g);
        if (!matches || matches.length === 0) return 0;
        return parseInt(matches[matches.length - 1], 10);
      };
      return getYear(b.year) - getYear(a.year);
    });
  }, [portfolio]);

  return (
    <section className="py-20 bg-[#F6F4EE] text-stone-900 font-serif border-t border-stone-300 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase font-bold block">
            SELECTED PORTFOLIO
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wider text-stone-900">
            影集作品 ｜ 光影電影紀錄
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
            精選商業形象、音樂 MV、人文旅讀、旅行生活紀錄、農會手機影音實戰與經典婚禮作品。
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sortedPortfolio.map((item) => (
            <div
              key={item.id}
              className="rounded bg-[#EFECE6] border border-stone-300 overflow-hidden shadow-sm group flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] bg-stone-300 overflow-hidden">
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
                  <button
                    onClick={() => setSelectedCase(item)}
                    className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="檢視細節"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F6F4EE] text-stone-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {item.videoUrl ? (
                        <Play className="w-5 h-5 fill-stone-900 ml-0.5" />
                      ) : (
                        <Eye className="w-5 h-5 text-stone-900" />
                      )}
                    </div>
                  </button>

                  <div className="absolute top-3 left-3 flex items-center gap-2 font-sans text-[11px]">
                    <span className="px-2.5 py-1 rounded bg-[#F6F4EE]/90 text-stone-900 font-bold border border-stone-300">
                      {item.category}
                    </span>
                  </div>

                  {item.videoUrl ? (
                    <div className="absolute top-3 right-3 font-sans text-[10px]">
                      <span className="px-2 py-1 rounded bg-red-700 text-white font-bold flex items-center gap-1 shadow-sm">
                        <Video className="w-3 h-3" />
                        <span>影片紀錄</span>
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 font-sans text-[10px]">
                      <span className="px-2 py-1 rounded bg-stone-900/80 text-stone-200 font-bold flex items-center gap-1 shadow-sm border border-stone-700">
                        <ImageIcon className="w-3 h-3" />
                        <span>代表主圖</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-xs font-sans text-stone-600">
                    專案：{item.clientOrProject} ｜ 角色：{item.role}
                  </p>
                  <p className="text-xs font-serif text-stone-700 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 font-sans text-[10px]">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-stone-200 border border-stone-300 text-stone-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedCase(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-stone-900 hover:bg-stone-800 text-[#F6F4EE] text-xs font-sans tracking-widest uppercase transition-all"
                >
                  <span>VIEW DETAILS / 檢視細節</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#F6F4EE] border border-stone-400 rounded-lg p-6 sm:p-8 text-stone-900 shadow-2xl font-serif">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-200 text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-2.5 py-0.5 rounded bg-stone-200 text-stone-800 text-xs font-sans font-bold mb-2 border border-stone-300">
              {selectedCase.category}
            </span>

            <h3 className="text-xl font-bold text-stone-900 mb-1">{selectedCase.title}</h3>
            <p className="text-xs font-sans text-stone-600 mb-4">創辦人角色：{selectedCase.role}</p>

            {getYouTubeEmbedUrl(selectedCase.videoUrl) ? (
              <div className="aspect-video rounded overflow-hidden mb-4 border border-stone-300 bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedCase.videoUrl)!}
                  title={selectedCase.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded overflow-hidden mb-4 border border-stone-300 bg-stone-200">
                <img
                  src={selectedCase.image || STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.src !== STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL) {
                      e.currentTarget.src = STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL;
                    }
                  }}
                />
              </div>
            )}

            {selectedCase.videoUrl && (
              <div className="mb-4">
                <a
                  href={selectedCase.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white text-xs font-sans font-bold transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>前往 YouTube 觀看完整影音作品</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <p className="text-xs font-serif text-stone-700 leading-relaxed mb-4">
              {selectedCase.description}
            </p>

            <div className="space-y-1.5 mb-6 text-xs font-sans">
              <span className="font-bold text-stone-900 uppercase tracking-wider block">專案亮點：</span>
              {selectedCase.highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 text-stone-700">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCase(null)}
              className="w-full py-2.5 rounded bg-stone-900 text-[#F6F4EE] font-sans font-bold text-xs uppercase tracking-widest"
            >
              CLOSE / 關閉視窗
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
