import React, { useState } from 'react';
import { FOUNDER_MILESTONES, AUDIENCE_PAIN_POINTS, FOUNDER_QUALIFICATIONS_DATA } from '../data/siteData';
import { useSiteData } from '../context/DataContext';
import { PageView } from '../types';
import { CineDimensionLogo } from './CineDimensionLogo';
import { FounderAvatar } from './FounderAvatar';
import { STATIC_ASSETS } from '../constants/assets';
import { Camera, Video, Smartphone, Award, Sparkles, ArrowRight, BookOpen, Layers, Briefcase, Bot, Film, CheckCircle2, ExternalLink, Download, GraduationCap } from 'lucide-react';

interface FounderStoryProps {
  onNavigate: (view: PageView) => void;
  onOpenContactWithService?: (serviceName: string) => void;
}

export const FounderStory: React.FC<FounderStoryProps> = ({ onNavigate, onOpenContactWithService }) => {
  const { founderInfo, assets } = useSiteData();
  const [activeTab, setActiveTab] = useState<'story' | 'qualifications' | 'impact'>('story');

  const getMilestoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-4 h-4 text-stone-800" />;
      case 'Video': return <Video className="w-4 h-4 text-stone-800" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-stone-800" />;
      default: return <Sparkles className="w-4 h-4 text-stone-800" />;
    }
  };

  // Format quote string into 3 distinct lines if containing newlines
  const quoteLines = founderInfo.quote
    ? founderInfo.quote.split('\n').filter(Boolean)
    : [
        '別讓完美主義偷走你開始的勇氣。',
        '技術可以被 AI 簡化',
        '但鏡頭下的溫度無法被取代。'
      ];

  return (
    <section className="py-16 sm:py-20 bg-[#F6F4EE] text-stone-900 font-serif border-t border-stone-300 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase font-bold block">
            THE FOUNDER'S JOURNEY
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-wider text-stone-900">
            BIO ｜ 創辦人 悟哥故事
          </h1>
          <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
            從 10 公斤重的單眼閃光燈高壓婚禮紀實，到口袋裡隨手拍出的手機電影感與 AI 智慧工作流。
          </p>
        </div>

        {/* Brand Logo & Philosophy Banner */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#EFECE6] border border-stone-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-[#F6F4EE] border border-stone-300 p-3 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={assets.logo || STATIC_ASSETS.LOGO}
                alt="維度影學 Brand Emblem Logo"
                className="w-full h-full object-contain drop-shadow-sm scale-110"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('Logo.svg') && !target.src.includes('logo.svg')) {
                    target.src = 'https://assets.cine-dimension.com/Logo.svg';
                  } else if (!target.src.includes('logo.JPG')) {
                    target.src = 'https://assets.cine-dimension.com/logo.JPG';
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-wider leading-tight">
                    維度影學
                  </h2>
                  <p className="text-sm sm:text-base font-sans font-bold tracking-[0.22em] text-stone-800 uppercase mt-0.5">
                    CINE DIMENSION
                  </p>
                </div>
                <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 border border-stone-300 font-semibold self-center md:self-start mt-1">
                  Brand Emblem
                </span>
              </div>
              <p className="text-xs sm:text-sm font-sans font-semibold text-amber-900 tracking-wide pt-1">
                Have Fun 享受創作 ｜ 用手機拍出真實的電影感
              </p>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                由創辦人悟哥創立之影視美學與 AI 賦能講學品牌。結合 18 年商業實戰經驗，以「先求有，再求好」的理念，陪伴學員在生活中找到專屬的影像溫度。
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#F6F4EE] text-xs font-sans font-bold tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>瀏覽代表影集</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Founder Bio Hero Card */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#EFECE6] border border-stone-300 shadow-sm relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Image Column */}
            <div className="md:col-span-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-stone-300 shadow-sm relative group bg-stone-200">
                <FounderAvatar
                  src={assets.founderImage || founderInfo.image || STATIC_ASSETS.AVATAR}
                  alt={`${founderInfo.name}（${founderInfo.nickname}）`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Text & Story Quote Column */}
            <div className="md:col-span-8 space-y-5 text-left">
              
              {/* 1. Golden Quote: Structured into 3 lines */}
              <blockquote className="p-4 sm:p-5 rounded-xl bg-[#F6F4EE] border-l-4 border-stone-900 text-stone-900 text-sm sm:text-base font-serif italic shadow-2xs space-y-1">
                {quoteLines.map((line, idx) => (
                  <p key={idx} className="leading-relaxed font-semibold">
                    {line}
                  </p>
                ))}
              </blockquote>

              {/* 2. Structured Bio: 3 refined paragraphs */}
              <div className="space-y-3.5 text-stone-700 text-xs sm:text-sm font-serif leading-relaxed text-justify sm:text-left">
                <p>
                  我是吳政維（悟哥）。18 年前的暑期，我在大學遇見啟蒙老師 Tom，從 Maya 3D 建模與婚禮紀錄開始，踏入了影像大門。
                </p>
                <p>
                  接下來的 5 年裡，我磨練構圖與燈光控光，堅持每場拍攝「比上一次進步 0.1 分」。2011 年團隊引進 DSLR 動態錄影，累積上百場高壓現場走位經驗，並擔綱 SHELL 喜力汽車影片與樂團 MV《說不愛就不愛》導演與攝影。
                </p>
                <p>
                  如今創辦維度影學，受邀擔任嘉義縣竹崎地區農會「手機影音實戰班」特聘講師與苗栗縣總工會「產業人才投資方案-提升勞工自主學習計畫」講師，結合手機隨手拍與 AI 工具，陪伴上百位學員擺脫完美主義焦慮。
                </p>
              </div>

              {/* 3. Refined Tags & Portaly Link */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-sans">
                <span className="px-3 py-1.5 rounded-full bg-stone-200 text-stone-800 border border-stone-300 font-medium flex items-center gap-1.5 shadow-2xs">
                  <span>🏆</span> 大俠攝影教室｜專任特聘講師
                </span>
                <span className="px-3 py-1.5 rounded-full bg-stone-200 text-stone-800 border border-stone-300 font-medium flex items-center gap-1.5 shadow-2xs">
                  <span>🏛️</span> 嘉義竹崎農會＆苗栗總工會特聘講師
                </span>
                <span className="px-3 py-1.5 rounded-full bg-stone-200 text-stone-800 border border-stone-300 font-medium flex items-center gap-1.5 shadow-2xs">
                  <span>🎬</span> 18年影視光影與 AI 工作流導師
                </span>
              </div>

              {/* 4. Portaly Channel Action */}
              <div className="pt-3 border-t border-stone-300/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-sans text-stone-600">
                  <GraduationCap className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>線上課程與免費資源下載：</span>
                </div>
                <a
                  href="https://portaly.cc/cinedimension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-xs font-bold transition-all shadow-sm group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>前往 Portaly 傳送門</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Portaly Showcase Banner */}
        <div className="mb-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-[#F6F4EE] border border-stone-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-sans font-semibold border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                ONLINE PORTAL & FREE RESOURCES
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
              悟哥 Portaly 個人線上課程 ＆ 免費資源下載傳送門
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-serif leading-relaxed">
              匯聚精選線上影音系統課、AI 實戰 Prompt 提示詞庫、免費素材與手機攝影學習指引。不受時間地點限制，隨時隨地開啟你的電影感創作旅程。
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://portaly.cc/cinedimension"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-sans text-xs font-bold tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-200" />
              <span>立即探索 Portaly 傳送門</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Tab Switching Control */}
        <div className="flex justify-center mb-10 font-sans text-xs uppercase tracking-widest">
          <div className="inline-flex p-1.5 rounded-xl bg-stone-200 border border-stone-300 gap-1.5 shadow-2xs">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-4 sm:px-5 py-2.5 rounded-lg transition-all font-bold cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-stone-900 text-[#F6F4EE] shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              18年光影演進軸
            </button>
            <button
              onClick={() => setActiveTab('qualifications')}
              className={`px-4 sm:px-5 py-2.5 rounded-lg transition-all font-bold cursor-pointer ${
                activeTab === 'qualifications'
                  ? 'bg-stone-900 text-[#F6F4EE] shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              專業資歷與代表實績
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 sm:px-5 py-2.5 rounded-lg transition-all font-bold cursor-pointer ${
                activeTab === 'impact'
                  ? 'bg-stone-900 text-[#F6F4EE] shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              Have Fun 輔導陪伴
            </button>
          </div>
        </div>

        {/* TAB 1: 18 YEARS TIMELINE */}
        {activeTab === 'story' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FOUNDER_MILESTONES.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-5 bg-[#EFECE6] border border-stone-300 space-y-3 text-left flex flex-col justify-between hover:border-stone-400 transition-all shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold font-mono text-stone-900 tracking-tight">{item.year}</span>
                      <div className="p-2 rounded-lg bg-stone-200">
                        {getMilestoneIcon(item.iconName)}
                      </div>
                    </div>
                    <h4 className="text-base font-serif font-bold text-stone-900 mb-1">{item.title}</h4>
                    <p className="text-xs font-serif text-stone-600 mb-2 font-medium">{item.subtitle}</p>
                    <p className="text-stone-700 text-xs font-serif leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-3 border-t border-stone-300 text-[10px] font-sans text-stone-500 uppercase tracking-widest font-semibold">
                    Phase {idx + 1} ｜ {item.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QUALIFICATIONS & CAPABILITIES & TRACK RECORD */}
        {activeTab === 'qualifications' && (
          <div className="space-y-8 text-left">
            
            {/* 1. 專業背景與教學經歷 */}
            <div className="rounded-2xl p-6 sm:p-8 bg-[#EFECE6] border border-stone-300 space-y-5 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-stone-300 pb-4">
                <div className="p-2 rounded-lg bg-stone-900 text-[#F6F4EE]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-stone-500 uppercase font-bold block">
                    TEACHING & APPOINTMENTS
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    一、{FOUNDER_QUALIFICATIONS_DATA.teaching.title}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {FOUNDER_QUALIFICATIONS_DATA.teaching.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl bg-[#F6F4EE] border border-stone-300/80 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <h4 className="text-sm font-serif font-bold text-stone-900">{item.main}</h4>
                      </div>
                      <p className="text-xs font-serif text-stone-600 pl-6 leading-relaxed">
                        {item.sub}
                      </p>
                    </div>

                    {item.subList && (
                      <div className="pl-6 pt-2 flex flex-wrap gap-1.5">
                        {item.subList.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2.5 py-1 rounded-md bg-stone-200 text-stone-800 text-[11px] font-sans font-medium border border-stone-300"
                          >
                            • {course}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 核心專長領域（攝影實戰 × AI 智能工作流） */}
            <div className="rounded-2xl p-6 sm:p-8 bg-[#EFECE6] border border-stone-300 space-y-6 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-stone-300 pb-4">
                <div className="p-2 rounded-lg bg-stone-900 text-[#F6F4EE]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-stone-500 uppercase font-bold block">
                    CORE EXPERTISE & AI WORKFLOW
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    二、{FOUNDER_QUALIFICATIONS_DATA.capabilities.title}
                  </h3>
                </div>
              </div>

              {/* Standard Core Capabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FOUNDER_QUALIFICATIONS_DATA.capabilities.categories
                  .filter(c => !c.isAi)
                  .map((cat, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#F6F4EE] border border-stone-300 space-y-1.5">
                      <h4 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
                        <Film className="w-4 h-4 text-stone-700" />
                        {cat.title}
                      </h4>
                      <p className="text-xs font-serif text-stone-600 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Special AI Enabled Workflow Feature Card */}
              {FOUNDER_QUALIFICATIONS_DATA.capabilities.categories
                .filter(c => c.isAi)
                .map((aiCat, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-[#EAE6DD] to-[#E3DFD5] border-2 border-stone-400 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-stone-900" />
                        <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900">
                          【{aiCat.title}】
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-[#F6F4EE] text-[10px] font-sans font-bold tracking-widest uppercase">
                        AI Empowered
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      {aiCat.features?.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-4 rounded-lg bg-[#F6F4EE]/90 border border-stone-300 space-y-2 flex flex-col justify-between"
                        >
                          <h5 className="text-xs sm:text-sm font-serif font-bold text-stone-900 flex items-start gap-1.5">
                            <span className="text-amber-800">✦</span>
                            <span>{feat.name}</span>
                          </h5>
                          <p className="text-xs font-serif text-stone-700 leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* 3. 代表實績與特約合作 */}
            <div className="rounded-2xl p-6 sm:p-8 bg-[#EFECE6] border border-stone-300 space-y-6 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-stone-300 pb-4">
                <div className="p-2 rounded-lg bg-stone-900 text-[#F6F4EE]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-stone-500 uppercase font-bold block">
                    TRACK RECORD & CLIENTS
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    三、{FOUNDER_QUALIFICATIONS_DATA.trackRecord.title}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FOUNDER_QUALIFICATIONS_DATA.trackRecord.groups.map((grp, idx) => (
                  <div key={idx} className="space-y-3.5">
                    <div className="px-3 py-1.5 rounded-lg bg-stone-300 text-stone-900 text-xs font-sans font-bold tracking-wider uppercase inline-block">
                      {grp.category}
                    </div>
                    <div className="space-y-3">
                      {grp.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-4 rounded-xl bg-[#F6F4EE] border border-stone-300 space-y-1 hover:border-stone-400 transition-colors"
                        >
                          <h5 className="text-xs sm:text-sm font-serif font-bold text-stone-900">
                            • {item.name}
                          </h5>
                          <p className="text-xs font-serif text-stone-600 pl-3 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: AUDIENCE IMPACT & PAIN POINTS */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AUDIENCE_PAIN_POINTS.map((pain, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-[#EFECE6] border border-stone-300 space-y-4 text-left flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 text-[10px] font-sans font-bold border border-stone-300">
                      {pain.badge}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-stone-900">
                      {pain.target}
                    </h4>
                    <p className="p-3.5 rounded-xl bg-[#F6F4EE] border border-stone-300 text-stone-700 text-xs leading-relaxed font-serif">
                      {pain.situation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-200/90 space-y-1 border border-stone-300/60">
                    <span className="text-[11px] font-sans font-bold text-stone-900 block">悟哥陪伴解方：</span>
                    <p className="text-stone-800 text-xs font-serif italic leading-relaxed">
                      {pain.wuMessage}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenContactWithService) {
                        onOpenContactWithService(pain.badge);
                      } else {
                        onNavigate('services');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#F6F4EE] text-xs font-sans tracking-widest uppercase font-semibold transition-colors cursor-pointer"
                  >
                    PRE-BOOK CONSULTATION / 預約諮詢
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
