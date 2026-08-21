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
            真實甜點品牌創辦人、嘉義竹崎農會返鄉青農與行銷總監的學習反饋。
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
                  className="w-9 h-9 rounded-full object-cover border border-stone-400"
                  referrerPolicy="no-referrer"
                />
                <div className="font-sans text-xs">
                  <h4 className="font-bold text-stone-900">{t.name}</h4>
                  <p className="text-stone-600 text-[11px]">{t.role} ｜ {t.organization}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
