import React from 'react';
import { PageView, PortfolioItem } from '../types';
import { Exhibition } from './Exhibition';

interface HeroProps {
  works?: PortfolioItem[];
  onNavigate: (view: PageView) => void;
  onPlayTrailer?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ works, onNavigate, onPlayTrailer }) => {
  return (
    <div className="bg-[#F6F4EE] text-stone-900 font-serif selection:bg-stone-300 selection:text-stone-900">
      
      {/* 1. Header Brackets Title Section */}
      <section className="pt-12 pb-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Top Bracket Decoration */}
          <div className="flex justify-between items-center text-stone-400 font-sans text-xs px-2">
            <span>┌</span>
            <span>┐</span>
          </div>

          <div className="py-2 space-y-3">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-widest text-stone-900 uppercase">
              維度影學
            </h1>
            <p className="text-xs sm:text-sm font-sans tracking-[0.25em] text-stone-600 uppercase">
              CINE DIMENSION ｜ 電影感影像創作與實戰講學
            </p>
          </div>

          {/* Bottom Bracket Decoration */}
          <div className="flex justify-between items-center text-stone-400 font-sans text-xs px-2">
            <span>└</span>
            <span>┘</span>
          </div>

          {/* Subtitle / Philosophy */}
          <p className="text-xs sm:text-sm font-serif italic text-stone-600 pt-2 leading-relaxed max-w-lg mx-auto">
            「別讓完美主義偷走你開始的勇氣。用鏡頭記錄真實的呼吸感與光影溫度，拍出屬於你的故事維度。」
          </p>

        </div>
      </section>

      {/* 2. 代表作展覽 (Selected Works Exhibition Timeline) */}
      <Exhibition
        works={works}
        onNavigate={onNavigate}
        onPlayTrailer={onPlayTrailer}
      />

    </div>
  );
};

