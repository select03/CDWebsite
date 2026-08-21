import React from 'react';
import { X, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { FOUNDER_INFO } from '../data/siteData';

interface VideoTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToServices: () => void;
}

export const VideoTrailerModal: React.FC<VideoTrailerModalProps> = ({
  isOpen,
  onClose,
  onNavigateToServices
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close trailer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>維度影學 ｜ 品牌故事精華</span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          {FOUNDER_INFO.name}（悟哥）的手機電影感創作理念
        </h3>

        {/* Video Canvas Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 my-4 group">
          <img
            src="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80"
            alt="Trailer cover"
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 mb-3 animate-pulse">
              <Play className="w-7 h-7 fill-slate-950 ml-1" />
            </div>
            <p className="text-sm font-semibold text-white max-w-md">
              「你不需要十幾公斤的重裝備，才能記錄生活裡的電影感。」
            </p>
            <span className="text-xs text-amber-300 mt-2">
              （展示影音導覽：結合手機隨手拍、快剪與 AI 輔助流程）
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 mb-6">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>18 年光影鏡頭，跨越靜態至動態錄影</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>嘉義縣竹崎地區農會特聘手機影音講師</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            關閉視窗
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToServices();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
          >
            觀看全部課程與培訓方案
          </button>
        </div>

      </div>
    </div>
  );
};
