import React from 'react';
import { useSiteData } from '../context/DataContext';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials } = useSiteData();

  return (
    <section className="py-20 bg-[#F6F4EE] text-stone-900 font-serif border-t border-stone-300 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase font-bold block">
            STUDENT REVIEWS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wider text-stone-900">
            學員與合作單位評價
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
            嘉義竹崎農會手機影音實戰班青農學員與主辦單位的真實課後產值反饋。
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded p-6 bg-[#EFECE6] border border-stone-300 space-y-4 text-left flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-700">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-700" />
                    ))}
                  </div>
                  <span className="text-[10px] font-sans font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded border border-stone-300">
                    {t.serviceUsed}
                  </span>
                </div>

                <p className="text-stone-800 text-xs font-serif leading-relaxed italic relative">
                  {t.quote}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-3 border-t border-stone-300 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-400/80 shadow-xs bg-stone-100 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized initial if image fails
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <div className="font-sans text-xs min-w-0">
                  <h4 className="font-bold text-stone-900">{t.name}</h4>
                  <p className="text-stone-600 text-[11px] truncate">{t.role} ｜ {t.organization}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
