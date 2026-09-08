import React from 'react';
import { ServiceItem } from '../types';
import { X, CheckCircle2, Clock, Video, Users, Sparkles, BookOpen, ArrowRight, FileText, ShieldCheck } from 'lucide-react';

interface CourseDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectForContact: (serviceTitle: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  service,
  onClose,
  onSelectForContact
}) => {
  if (!service) return null;

  const isEnterpriseTraining = service.id === 'enterprise-training';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-y-auto p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{service.categoryLabel}</span>
          {service.priceTag && (
            <span className="ml-1 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold text-[10px]">
              {service.priceTag}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {service.title}
        </h2>
        <p className="text-amber-300 text-sm font-medium mb-6">
          {service.tagline}
        </p>

        {/* Feature Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">預計時長</span>
              <span className="font-semibold text-slate-200">{service.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">授課形式</span>
              <span className="font-semibold text-slate-200">{service.format}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">創辦人親授</span>
              <span className="font-semibold text-amber-300">悟哥親自點評作業</span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-4 mb-6 text-slate-300 text-sm leading-relaxed">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>課程/服務詳細介紹</span>
          </h3>
          <p>{service.description}</p>
        </div>

        {/* Curriculum Modules / Milestones */}
        {service.modules && service.modules.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isEnterpriseTraining ? '四大實戰學習里程碑（成果交付導向）' : '核心學習模組大綱'}</span>
              </h3>
              {isEnterpriseTraining && (
                <span className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  獨家心法架構
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {service.modules.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs flex items-center justify-center font-mono shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{mod.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-8">{mod.description}</p>
                </div>
              ))}
            </div>

            {/* Anti-copying Notice & Proposal Request Banner for B2B */}
            {isEnterpriseTraining && (
              <div className="mt-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-slate-300">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>農會與公家機構行政支援</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    為保護專利教案，官網僅揭露四大核心階段。如需正式「12 小時詳細課綱、器材清單與招標報價企劃書」，歡迎點擊免費索取。
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectForContact('索取【農會・企業客製影音內訓】完整 12 小時課綱企劃書');
                    onClose();
                  }}
                  className="shrink-0 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>索取完整課綱企劃書 (PDF)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Key Highlights Checklist */}
        <div className="space-y-3 mb-8">
          <h3 className="text-base font-bold text-white">帶給你的關鍵收穫</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {service.highlights.map((h, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2 mb-8">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">適合學習對象：</span>
          <div className="flex flex-wrap gap-2">
            {service.targetAudience.map((aud, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                {aud}
              </span>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            可預約團體報名、企業包班或個人一對一輔導
          </div>
          <button
            onClick={() => {
              onSelectForContact(service.title);
              onClose();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <span>立即預約洽詢此項目</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
