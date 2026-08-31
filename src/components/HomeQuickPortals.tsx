import React from 'react';
import { PageView } from '../types';
import { useSiteData } from '../context/DataContext';
import { FounderAvatar } from './FounderAvatar';
import { ArrowRight, User, BookOpen, Film, Send } from 'lucide-react';

interface HomeQuickPortalsProps {
  onNavigate: (view: PageView) => void;
}

export const HomeQuickPortals: React.FC<HomeQuickPortalsProps> = ({ onNavigate }) => {
  const { founderInfo } = useSiteData();

  const portals = [
    {
      id: 'about' as PageView,
      category: 'ABOUT & STORY',
      title: 'ABOUT ｜ 品牌故事與理念',
      desc: '18 年影視實戰淬煉，從高壓婚禮、商業大片到手機電影感與 AI 講學。',
      image: founderInfo.image,
      badge: '18年影視實戰',
      actionText: '閱讀品牌故事',
      icon: <User className="w-4 h-4 text-stone-700" />
    },
    {
      id: 'services' as PageView,
      category: 'COURSES & WORKSHOPS',
      title: 'SERVICES ｜ 系統課程與企業內訓',
      desc: '《手機拍出電影感》系統課、AI動態影音營、嘉義農會及企業客製培訓。',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      badge: '熱門講學專案',
      actionText: '探索課程與培訓',
      icon: <BookOpen className="w-4 h-4 text-stone-700" />
    },
    {
      id: 'portfolio' as PageView,
      category: 'SELECTED CASES',
      title: 'WORKS ｜ 完整商業作品集',
      desc: '收錄 Shell 官方形象片、樂團 MV、農會品牌專案與溫暖婚禮電影全紀錄。',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      badge: '商業與影音精華',
      actionText: '瀏覽完整作品集',
      icon: <Film className="w-4 h-4 text-stone-700" />
    },
    {
      id: 'contact' as PageView,
      category: 'COLLABORATION',
      title: 'CONTACT ｜ 預約諮詢與合作洽詢',
      desc: '提供影像創作痛點諮詢、機構內訓合作評估與商業影像顧問專案諮詢。',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      badge: '快速回覆諮詢',
      actionText: '立即線上諮詢',
      icon: <Send className="w-4 h-4 text-stone-700" />
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EFECE6]/80 border-t border-stone-300">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase font-bold block">
            EXPLORE DIMENSIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            維度探索 ｜ 快速導覽
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-600">
            點擊下方任一專區，快速進入深入了解品牌故事、教學方案與商業作品
          </p>
        </div>

        {/* 4 Condensed Gateway Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => (
            <button
              key={portal.id}
              onClick={() => onNavigate(portal.id)}
              className="group text-left bg-[#F6F4EE] rounded-xl border border-stone-300 overflow-hidden shadow-sm hover:shadow-md hover:border-stone-800 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                {portal.id === 'about' ? (
                  <FounderAvatar
                    src={portal.image}
                    alt={portal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={portal.image}
                    alt={portal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/10 transition-colors" />
                <span className="absolute top-2.5 left-2.5 bg-[#F6F4EE]/90 backdrop-blur-sm text-stone-900 text-[10px] font-sans px-2 py-0.5 rounded font-medium border border-stone-300">
                  {portal.badge}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest text-stone-500 uppercase font-bold">
                    {portal.icon}
                    <span>{portal.category}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                    {portal.title}
                  </h3>
                  <p className="text-xs font-serif text-stone-600 line-clamp-2 leading-relaxed">
                    {portal.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-sans font-bold text-stone-800 group-hover:text-stone-950">
                  <span>{portal.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
