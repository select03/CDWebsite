import React, { useState, useEffect, useRef } from 'react';
import { PageView, PortfolioItem } from './types';
import { DataProvider, useData } from './context/DataContext';
import { PORTFOLIO_CASES } from './data/siteData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PhilosophySection } from './components/PhilosophySection';
import { FounderStory } from './components/FounderStory';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VideoTrailerModal } from './components/VideoTrailerModal';
import { HomeQuickPortals } from './components/HomeQuickPortals';
import { AdminCMS } from './components/AdminCMS';

const API_CONTENT_URL = 'https://cms-api.cine-dimension.com/api/content';

/**
 * 嚴格防重入、單次加載之全站動態內容 Hook
 * 1. 依賴項陣列嚴格為空 []，確保「只在元件初次掛載 (Mount) 時執行一次」
 * 2. 加入 useRef 防重入鎖定，杜絕 React 18/19 StrictMode 下重複觸發
 * 3. 移除 timestamp 參數與 no-store，允許 Cloudflare CDN 邊緣快取 60 秒
 */
export function useSiteContent(defaultData: any) {
  const [content, setContent] = useState(defaultData);
  const isFetchedRef = useRef(false); // 鎖定標記

  useEffect(() => {
    if (isFetchedRef.current) return; // 已經抓過就不再重複抓取
    isFetchedRef.current = true;

    async function loadOnce() {
      try {
        const res = await fetch(API_CONTENT_URL, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.content) {
          setContent(data.content);
        }
      } catch (err) {
        console.warn('載入動態資料失敗，維持本地資料:', err);
      }
    }

    loadOnce();
  }, []); // 關鍵：嚴格保持空陣列，禁止放入 content 或 works

  return content;
}

function MainAppContent() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const { isSyncingRemote, updateSiteInfo, updateAssets } = useData();

  // 1. 使用嚴格防護的 Hook 載入動態資料（單次加載 + useRef 鎖定）
  const remoteContent = useSiteContent(null);

  // 2. 本地狀態管理作品集
  const [works, setWorks] = useState<PortfolioItem[]>(PORTFOLIO_CASES);

  // 3. 當遠端資料抵達時僅同步一次至 Context 與視圖，嚴格防止重複執行
  const isContentAppliedRef = useRef(false);
  useEffect(() => {
    if (!remoteContent || isContentAppliedRef.current) return;
    isContentAppliedRef.current = true;

    if (remoteContent.portfolio && Array.isArray(remoteContent.portfolio) && remoteContent.portfolio.length > 0) {
      const defaultMap = new Map(PORTFOLIO_CASES.map(c => [c.id, c]));
      const mergedWorks = remoteContent.portfolio.map((item: any) => {
        const local = defaultMap.get(item.id);
        if (local) {
          const isRemoteOutdated = local.id === 'wedding-films-collection' && !item.description?.includes('關島');
          const finalImage = local.id === 'shell-lubricants-ad' ? local.image : (item.image || local.image);
          return {
            ...local,
            ...item,
            image: finalImage,
            description: isRemoteOutdated ? local.description : (item.description || local.description),
            highlights: isRemoteOutdated ? local.highlights : (item.highlights || local.highlights),
            tags: isRemoteOutdated ? local.tags : (item.tags || local.tags)
          };
        }
        return item;
      });
      setWorks(mergedWorks);
    }
    if (remoteContent.siteInfo) {
      updateSiteInfo(remoteContent.siteInfo);
      if (remoteContent.siteInfo.logoUrl) {
        updateAssets({ logo: remoteContent.siteInfo.logoUrl });
      }
    }
    if (remoteContent.assets) {
      updateAssets(remoteContent.assets);
    }
  }, [remoteContent, updateSiteInfo, updateAssets]);

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
        onSelectServiceForContact={handleSelectServiceForContact}
      />

      {/* VIEW CONDITIONAL RENDERINGS */}
      {currentView === 'home' && (
        <main>
          {/* 1. 代表作展覽 (Exhibition Timeline, sorted by year) */}
          <Hero
            works={works}
            onNavigate={handleNavigate}
            onPlayTrailer={() => setIsTrailerOpen(true)}
          />

          {/* 2. 四大教學支柱 (Four Teaching Pillars) */}
          <PhilosophySection onNavigate={handleNavigate} />

          {/* 3. 濃縮導覽區塊 (Condensed Portal Cards) */}
          <HomeQuickPortals
            onNavigate={handleNavigate}
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
          <PortfolioShowcase works={works} />
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
