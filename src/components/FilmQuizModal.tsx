import React, { useState } from 'react';
import { QUIZ_QUESTIONS, SERVICES_CATALOG } from '../data/siteData';
import { X, Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface FilmQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const FilmQuizModal: React.FC<FilmQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceForContact
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (recommendId: string) => {
    const updated = [...selectedAnswers, recommendId];
    setSelectedAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate most frequent recommended service
      const counts: Record<string, number> = {};
      updated.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
      });
      let bestId = updated[0];
      let maxCount = 0;
      Object.entries(counts).forEach(([id, count]) => {
        if (count > maxCount) {
          maxCount = count;
          bestId = id;
        }
      });
      setRecommendedId(bestId);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setRecommendedId(null);
  };

  const recommendedService = SERVICES_CATALOG.find(s => s.id === recommendedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>維度影學 ｜ 電影感創作適配性健檢</span>
        </div>

        {!recommendedService ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>問題 {currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
              <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>

            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.recommendId)}
                  className="w-full text-left p-4 rounded-xl bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/50 text-sm font-medium text-slate-200 hover:text-amber-300 transition-all flex items-center justify-between group"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* RESULT DISPLAY */
          <div className="space-y-6">
            <div className="text-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 mx-auto flex items-center justify-center font-bold text-xl mb-2">
                ✓
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">悟哥專屬建議方案</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {recommendedService.title}
              </h3>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              根據您的回答，最適合您目前階段的解決方案是《{recommendedService.title}》。{recommendedService.tagline}。
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-300 block">適合特色亮點：</span>
              {recommendedService.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                title="重新測驗"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重測</span>
              </button>

              <button
                onClick={() => {
                  onSelectServiceForContact(recommendedService.title);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>預約此方案諮詢 / 報名</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
