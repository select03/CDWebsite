import React, { useState } from 'react';
import { useSiteData } from '../context/DataContext';
import { ServiceItem, PageView } from '../types';
import { CourseDetailModal } from './CourseDetailModal';
import { Clock, Video, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';

interface ServicesSectionProps {
  onNavigate: (view: PageView) => void;
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onNavigate,
  onSelectServiceForContact
}) => {
  const { services } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = [
    { id: 'all', label: '全部講學服務' },
    { id: 'course', label: '手機電影感系統課' },
    { id: 'ai_workshop', label: 'AI 影音速成營' },
    { id: 'enterprise', label: '農會與企業培訓' },
    { id: 'consulting', label: '商業影像顧問' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section className="py-20 bg-[#F6F4EE] text-stone-900 font-serif border-t border-stone-300 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans tracking-[0.3em] text-stone-500 uppercase font-bold block">
            COURSES & MENTORSHIP
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-wider text-stone-900">
            SERVICES ｜ 講學課程與拍攝顧問
          </h1>
          <p className="text-xs sm:text-sm font-serif text-stone-600 leading-relaxed">
            擺脫繁雜設備與完美主義，陪伴你用隨手拍手機與 AI 工具拍出故事維度。
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-sans text-xs uppercase tracking-wider">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded transition-all font-semibold ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-[#F6F4EE]'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded bg-[#EFECE6] border border-stone-300 overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] bg-stone-300 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2 font-sans text-[11px]">
                    <span className="px-2.5 py-1 rounded bg-[#F6F4EE]/90 text-stone-900 font-bold border border-stone-300">
                      {service.categoryLabel}
                    </span>
                    {service.priceTag && (
                      <span className="px-2 py-1 rounded bg-stone-900 text-stone-100">
                        {service.priceTag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-3 text-left">
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs font-serif text-stone-600">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Format & Duration Meta */}
                  <div className="flex flex-wrap gap-4 text-xs font-sans text-stone-700 py-2 border-y border-stone-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-600" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-stone-600" />
                      <span>{service.format}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-serif text-stone-700 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-1.5 pt-2 text-xs font-sans">
                    <span className="font-bold text-stone-900 uppercase tracking-wider block">亮點特色：</span>
                    {service.highlights.slice(0, 3).map((h, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-3 font-sans text-xs">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-stone-200 hover:bg-stone-300 text-stone-900 font-semibold border border-stone-300"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-700" />
                  <span>檢視大綱細節</span>
                </button>

                <button
                  onClick={() => onSelectServiceForContact(service.title)}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-stone-900 hover:bg-stone-800 text-[#F6F4EE] font-bold tracking-wider uppercase"
                >
                  <span>BOOK / 預約報名</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Custom Customization Banner */}
        <div className="p-6 rounded bg-[#EFECE6] border border-stone-300 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1 font-serif">
            <h3 className="text-base font-bold text-stone-900">
              嘉義農會、地方機構或企業內訓客製包班？
            </h3>
            <p className="text-stone-600 text-xs font-sans">
              悟哥提供特製現場美學佈光與實戰拍剪 Sop 模組，歡迎直接進行需求預約。
            </p>
          </div>
          <button
            onClick={() => onSelectServiceForContact('企業與農會在地影音內訓工作坊')}
            className="shrink-0 px-5 py-2 rounded bg-stone-900 text-[#F6F4EE] text-xs font-sans font-bold uppercase tracking-widest"
          >
            CUSTOM REQUEST / 客製需求洽詢
          </button>
        </div>

      </div>

      {/* Syllabus Detail Modal */}
      <CourseDetailModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        onSelectForContact={onSelectServiceForContact}
      />
    </section>
  );
};
