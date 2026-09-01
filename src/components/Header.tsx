import React, { useState } from 'react';
import { PageView } from '../types';
import { CineDimensionLogo } from './CineDimensionLogo';
import { useData } from '../context/DataContext';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onSelectServiceForContact?: (serviceTitle: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate
}) => {
  const { assets } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string; enLabel: string }[] = [
    { id: 'home', label: '首頁展覽', enLabel: 'EXHIBITION' },
    { id: 'portfolio', label: '影集作品', enLabel: 'WORKS' },
    { id: 'about', label: '創辦人故事', enLabel: 'BIO' },
    { id: 'services', label: '講學服務', enLabel: 'SERVICES' },
    { id: 'contact', label: '預約聯繫', enLabel: 'CONTACT' },
  ];

  const handleNavClick = (id: PageView) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F6F4EE]/95 backdrop-blur-md border-b border-stone-300 transition-all py-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Minimal Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="group focus:outline-none flex items-center gap-2 shrink-0"
          >
            <CineDimensionLogo size="sm" showText={true} customLogo={assets?.logo} />
          </button>

          {/* Editorial Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 text-xs font-sans tracking-[0.12em] lg:tracking-[0.2em] uppercase font-medium text-stone-600 shrink-0">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-all duration-200 py-1 relative whitespace-nowrap ${
                    active
                      ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                      : 'hover:text-stone-900'
                  }`}
                >
                  {item.enLabel} <span className="text-[10px] text-stone-400 font-normal lowercase hidden xl:inline">/ {item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Editorial Action CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('contact')}
              className="text-[11px] font-sans tracking-widest uppercase bg-stone-900 text-[#F6F4EE] px-4 py-2 rounded hover:bg-stone-800 transition-all shadow-sm whitespace-nowrap font-medium"
            >
              BOOK / 預約諮詢
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="text-[10px] font-sans tracking-widest uppercase bg-stone-900 text-[#F6F4EE] px-2.5 py-1.5 rounded font-medium"
            >
              預約
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Photobook Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F4EE] border-b border-stone-300 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-3 font-serif">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left py-2 border-b border-stone-200 flex items-center justify-between text-base ${
                    active ? 'text-stone-900 font-bold border-stone-900' : 'text-stone-600'
                  }`}
                >
                  <span>{item.enLabel} — {item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-center py-2.5 text-xs uppercase tracking-widest bg-stone-900 text-[#F6F4EE] rounded font-bold"
            >
              CONTACT US / 預約諮詢
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
