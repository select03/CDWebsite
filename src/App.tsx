import React, { useState, useEffect } from 'react';
import { PageView } from './types';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PhilosophySection } from './components/PhilosophySection';
import { FounderStory } from './components/FounderStory';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FilmQuizModal } from './components/FilmQuizModal';
import { VideoTrailerModal } from './components/VideoTrailerModal';
import { HomeQuickPortals } from './components/HomeQuickPortals';
import { AdminCMS } from './components/AdminCMS';

function MainAppContent() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const { isSyncingRemote } = useData();

  // Support accessing CMS via secret URL hash (e.g. your-site.com/#admin or /#cms)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#cms') {
        setCurrentView('admin');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleSelectServiceForContact = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    setCurrentView('contact');
    setTimeout(() => {
      const el = document.getElementById('contact-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    if (view === 'contact') {
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-stone-900 font-serif selection:bg-stone-300 selection:text-stone-900 antialiased relative">
      
      {/* Subtle top indicator when syncing latest dynamic content from remote */}
      {isSyncingRemote && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 animate-pulse" />
      )}

      {/* Header Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onSelectServiceForContact={handleSelectServiceForContact}
      />

      {/* VIEW CONDITIONAL RENDERINGS */}
      {currentView === 'home' && (
        <main>
          {/* 1. 代表作展覽 (Exhibition Timeline, sorted by year) */}
          <Hero
            onNavigate={handleNavigate}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onPlayTrailer={() => setIsTrailerOpen(true)}
          />

          {/* 2. 四大教學支柱 (Four Teaching Pillars) */}
          <PhilosophySection onNavigate={handleNavigate} />

          {/* 3. 濃縮導覽區塊 (Condensed Portal Cards) */}
          <HomeQuickPortals
            onNavigate={handleNavigate}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        </main>
      )}

      {currentView === 'about' && (
        <main>
          <FounderStory
            onNavigate={handleNavigate}
            onOpenContactWithService={handleSelectServiceForContact}
          />
          <PhilosophySection onNavigate={handleNavigate} />
          <ContactSection
            preselectedService={preselectedService}
            onClearPreselectedService={() => setPreselectedService('')}
          />
        </main>
      )}

      {currentView === 'services' && (
        <main>
          <ServicesSection
            onNavigate={handleNavigate}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
          <PhilosophySection onNavigate={handleNavigate} />
          <ContactSection
            preselectedService={preselectedService}
            onClearPreselectedService={() => setPreselectedService('')}
          />
        </main>
      )}

      {currentView === 'portfolio' && (
        <main>
          <PortfolioShowcase />
          <Testimonials />
          <ContactSection
            preselectedService={preselectedService}
            onClearPreselectedService={() => setPreselectedService('')}
          />
        </main>
      )}

      {currentView === 'contact' && (
        <main>
          <ContactSection
            preselectedService={preselectedService}
            onClearPreselectedService={() => setPreselectedService('')}
          />
          <Testimonials />
        </main>
      )}

      {currentView === 'admin' && (
        <main>
          <AdminCMS onNavigate={handleNavigate} />
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <FilmQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectServiceForContact={handleSelectServiceForContact}
      />

      <VideoTrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onNavigateToServices={() => handleNavigate('services')}
      />

    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainAppContent />
    </DataProvider>
  );
}
