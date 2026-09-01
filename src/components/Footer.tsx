import React from 'react';
import { PageView } from '../types';
import { useSiteData } from '../context/DataContext';
import { CineDimensionLogo } from './CineDimensionLogo';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { founderInfo, assets } = useSiteData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#EFECE6] border-t border-stone-300 text-stone-900 font-serif pt-16 pb-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-stone-300">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3 text-left">
            <CineDimensionLogo size="sm" showText={true} customLogo={assets?.logo} />
            <p className="text-stone-600 text-xs leading-relaxed max-w-sm pt-2">
              {founderInfo.title}。主張「Have Fun」樂趣學習哲學，結合手機隨手拍與 AI 工具，陪伴你輕鬆拍出屬於你的故事維度。
            </p>
            <p className="text-stone-800 text-[11px] font-sans font-semibold pt-1">
              {founderInfo.taglines.join(' ｜ ')}
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-2 text-left text-xs font-sans">
            <h4 className="font-bold text-stone-900 uppercase tracking-widest text-[11px]">MAP ｜ 網站導覽</h4>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <button onClick={() => { onNavigate('home'); scrollToTop(); }} className="hover:text-stone-900 transition-colors">
                  EXHIBITION 展覽首頁
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('about'); scrollToTop(); }} className="hover:text-stone-900 transition-colors">
                  BIO 創辦人故事
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('services'); scrollToTop(); }} className="hover:text-stone-900 transition-colors">
                  SERVICES 講學課程
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('portfolio'); scrollToTop(); }} className="hover:text-stone-900 transition-colors">
                  WORKS 影集作品
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('contact'); scrollToTop(); }} className="hover:text-stone-900 transition-colors">
                  CONTACT 預約聯繫
                </button>
              </li>
            </ul>
          </div>

          {/* Channels */}
          <div className="md:col-span-4 space-y-2 text-left text-xs font-sans">
            <h4 className="font-bold text-stone-900 uppercase tracking-widest text-[11px]">CHANNELS ｜ 官方管道</h4>
            <div className="space-y-1.5 text-stone-600">
              <p>• 官網：<a href={founderInfo.socials.website} target="_blank" rel="noopener noreferrer" className="text-stone-900 underline">cine-dimension.com</a></p>
              <p>• Portaly 傳送門：<a href={founderInfo.socials.portaly || 'https://portaly.cc/cinedimension'} target="_blank" rel="noopener noreferrer" className="text-amber-900 font-bold hover:underline">portaly.cc/cinedimension</a>（線上課/免費資源）</p>
              <p>• Contact：<a href={`mailto:${founderInfo.socials.email}`} className="text-stone-900 font-medium hover:underline">{founderInfo.socials.email}</a></p>
              <p>• YouTube：<a href="https://www.youtube.com/@cinedimens" target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:underline">@cinedimens</a></p>
              <p>• Facebook 粉絲團：<a href="https://www.facebook.com/profile.php?id=100093152435465&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:underline">維度影學 Cine Dimension</a></p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-stone-500">
          <p>© {new Date().getFullYear()} 維度影學 Cine Dimension. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors border border-stone-300"
          >
            <span>TOP / 回到頂端</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
