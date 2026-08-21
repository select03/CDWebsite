import React from 'react';
import { BRAND_PILLARS } from '../data/siteData';
import { Sparkles, Film, Video, Brain, Layers, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface PhilosophyProps {
  onNavigate: (view: PageView) => void;
}

export const PhilosophySection: React.FC<PhilosophyProps> = ({ onNavigate }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-stone-800" />;
      case 'Film': return <Film className="w-5 h-5 text-stone-800" />;
      case 'Video': return <Video className="w-5 h-5 text-stone-800" />;
      case 'Brain': return <Brain className="w-5 h-5 text-stone-800" />;
      default: return <Layers className="w-5 h-5 text-stone-800" />;
    }
  };

  return (
    <section className="py-20 bg-[#F6F4EE] text-stone-900 font-serif border-t border-stone-300 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase font-bold block">
            CORE PHILOSOPHY
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wider text-stone-900">
            維度影學四大教學支柱
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
            以「Have Fun」為學習的核心心法，讓攝影不再是高深難懂的器材包袱。
          </p>
        </div>

        {/* Grid of 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded p-6 bg-[#EFECE6] border border-stone-300 space-y-3 text-left shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-lg text-stone-900">
                    {pillar.number}
                  </span>
                  <div className="p-2 rounded bg-stone-200">
                    {getIcon(pillar.iconName)}
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                  {pillar.title}
                </h3>
                <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-700 mb-2">
                  {pillar.subtitle}
                </span>

                <p className="text-stone-700 text-xs font-serif leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-300 text-[10px] font-sans text-stone-500 uppercase tracking-widest">
                SYSTEMATIC METHOD
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-6 rounded bg-[#EFECE6] border border-stone-300 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1 font-serif">
            <h4 className="text-base font-bold text-stone-900">
              準備好用手裡的手機，拍出你的故事電影感了嗎？
            </h4>
            <p className="text-stone-600 text-xs font-sans">
              擺脫完美主義焦慮，悟哥帶你「拍剪傳」一氣呵成。
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 px-5 py-2.5 rounded bg-stone-900 text-[#F6F4EE] text-xs font-sans font-bold uppercase tracking-widest"
          >
            EXPLORE COURSES / 選購服務課程
          </button>
        </div>

      </div>
    </section>
  );
};
