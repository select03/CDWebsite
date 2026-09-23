import React from 'react';
import { useSiteData } from '../context/DataContext';
import { Mic, Sparkles, ExternalLink, Film, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface CreatorToolkitProps {
  id?: string;
  className?: string;
}

export const CreatorToolkit: React.FC<CreatorToolkitProps> = ({
  id = 'creator-toolkit',
  className = ''
}) => {
  const { tools, siteInfo } = useSiteData();

  const typelessTool = tools?.find(t => t.id === 'typeless') || {
    id: 'typeless',
    name: 'Typeless',
    category: 'AI 語音靈感速記 × 分鏡腳本生成',
    tagline: '開口碎念即成電影感腳本與分鏡大綱',
    badge: '悟哥工作流必備',
    description: '靈感稍縱即逝，邊開車邊勘景怎麼寫分鏡？我不習慣盯著螢幕打字，而是對著手機碎碎念。Typeless 能自動去除贅字、理清邏輯，快速生成結構化短影音腳本與口播文案，是維度影學高產出的幕後功臣。',
    affiliateUrl: siteInfo?.typelessUrl || 'https://www.typeless.com/?via=cinedimension',
    ctaText: '體驗悟哥專屬 Typeless 連結',
    features: [
      '口語碎念秒轉條列式短影音分鏡',
      '自動消除口頭禪、修飾語氣與贅詞',
      '跨裝置同步，隨時捕捉街頭攝影與勘景靈感'
    ]
  };

  const affiliateUrl = siteInfo?.typelessUrl || typelessTool.affiliateUrl || 'https://www.typeless.com/?via=cinedimension';

  return (
    <section
      id={id}
      className={`relative py-24 px-4 sm:px-6 lg:px-8 bg-[#08090c] text-stone-200 overflow-hidden border-t border-b border-[#a3845b]/20 selection:bg-[#a3845b]/30 selection:text-white ${className}`}
    >
      {/* Cinematic Ambient Background Lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(163,132,91,0.18),transparent_70%)]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 -translate-x-1/2 bg-[#a3845b]/5 rounded-full blur-3xl" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 translate-x-1/3 translate-y-1/3 bg-amber-500/5 rounded-full blur-3xl" 
      />

      <div className="relative max-w-5xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.3em] uppercase text-[#a3845b] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#a3845b]" />
            <span>CREATOR&apos;S TOOLKIT · 工作流秘密武器</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            悟哥的導演幕後裝備：<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5c792] via-[#a3845b] to-[#d4af37]">開口即成電影感腳本</span>
          </h2>

          <p className="text-stone-400 text-xs sm:text-sm font-serif leading-relaxed max-w-2xl mx-auto">
            在「維度影學」，我們深信好內容來自專注的心流，而非被鍵盤敲擊與打字瑣事耗盡精力。
            這是我日常開車勘景、靈感閃現時，必不可少的核心數位裝備。
          </p>
        </div>

        {/* Feature Showcase Card - Glassmorphism Panel */}
        <div className="relative rounded-2xl bg-white/[0.02] border border-[#a3845b]/30 backdrop-blur-xl p-8 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-[#a3845b]/50 transition-all duration-500">
          
          {/* Subtle Corner Accent Light */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#a3845b]/20 to-transparent rounded-tr-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Tool Badge & Category */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-sans font-semibold tracking-wider px-2.5 py-1 rounded bg-[#a3845b]/15 text-[#e5c792] border border-[#a3845b]/40">
                  {typelessTool.badge || '悟哥工作流必備'}
                </span>
                <span className="text-xs font-sans text-stone-400 tracking-wider">
                  {typelessTool.category}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a3845b]/30 to-[#a3845b]/10 border border-[#a3845b]/40 flex items-center justify-center text-[#e5c792] shadow-inner">
                    <Mic className="w-5 h-5 text-[#e5c792]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                    {typelessTool.name}
                  </h3>
                </div>

                <p className="text-sm sm:text-base font-serif text-[#e5c792] font-medium leading-snug">
                  「{typelessTool.tagline}」
                </p>
              </div>

              {/* Founder's Personal Insight / Quote */}
              <div className="relative pl-4 border-l-2 border-[#a3845b]/60 space-y-1 py-1">
                <p className="text-xs sm:text-sm font-serif text-stone-300 leading-relaxed italic">
                  {typelessTool.description}
                </p>
                <span className="block text-[11px] font-sans tracking-widest text-[#a3845b] font-medium pt-1">
                  —— 吳政維（悟哥）／ 維度影學 創辦人
                </span>
              </div>

              {/* Feature Points */}
              <div className="space-y-2.5 pt-1">
                <span className="block text-xs font-sans font-bold uppercase tracking-widest text-stone-400">
                  實戰效能亮點：
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {typelessTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-sans text-stone-300">
                      <CheckCircle2 className="w-4 h-4 text-[#a3845b] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#a3845b] via-[#bfa075] to-[#a3845b] hover:from-[#bfa075] hover:to-[#e5c792] text-[#08090c] font-sans font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#a3845b]/20 hover:shadow-[#a3845b]/40 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span>{typelessTool.ctaText || '體驗悟哥專屬 Typeless 連結'}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <span className="text-[11px] font-sans text-stone-500">
                  ＊點擊專屬連結體驗，快速打造無痛語音腳本心流
                </span>
              </div>

            </div>

            {/* Right Visual / Workflow Simulation Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl bg-black/40 border border-[#a3845b]/20 p-6 space-y-5 backdrop-blur-md shadow-2xl">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3 text-xs font-sans">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#a3845b]" />
                    <span>DIRECTOR WORKFLOW</span>
                  </span>
                  <span className="text-[#a3845b] font-mono text-[10px] tracking-wider">
                    SPEECH TO SCRIPT
                  </span>
                </div>

                {/* Step 1: Voice Input Simulation */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3 text-red-400 animate-pulse" />
                      <span>現場語音碎念速記：</span>
                    </span>
                    <span className="font-mono text-[10px] text-stone-600">INPUT 00:24</span>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 text-xs font-serif text-stone-400 italic leading-relaxed">
                    「呃那個...今天在嘉義農會勘景，那個晨光剛好打在茶園梯田上，畫面超美，前三秒先給推軌特寫茶葉上的露珠，然後接青農採茶的眼神...」
                  </div>
                </div>

                {/* Transforming Arrow */}
                <div className="flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#a3845b]/20 border border-[#a3845b]/40 flex items-center justify-center text-[#e5c792]">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Step 2: Structured Output Simulation */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] font-sans text-stone-400">
                    <span className="flex items-center gap-1 text-[#e5c792] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#e5c792]" />
                      <span>Typeless 電影分鏡腳本：</span>
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">STRUCTURED</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#a3845b]/5 border border-[#a3845b]/30 space-y-2 text-xs font-mono text-stone-200">
                    <div className="flex items-start gap-2">
                      <span className="text-[#e5c792] font-bold">C01:</span>
                      <span className="font-sans text-stone-300">【特寫】清晨斜射光穿透茶葉露珠，慢速推軌（3秒）</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#e5c792] font-bold">C02:</span>
                      <span className="font-sans text-stone-300">【中景】青農指尖熟練採摘一心二葉，專注神情（4秒）</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#e5c792] font-bold">旁白:</span>
                      <span className="font-sans text-[#e5c792] italic">「每一片茶葉，都是大自然與晨光的第一份呼吸。」</span>
                    </div>
                  </div>
                </div>

                {/* Workflow Badge Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-sans text-stone-500 border-t border-stone-800/80">
                  <span>省去 80% 腳本整理時間</span>
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e5c792] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>即刻導入工作流</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
