import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FounderInfo, ServiceItem, PortfolioItem, Testimonial, InquiryLead, SiteAssets, SiteMetaInfo } from '../types';
import { FOUNDER_INFO, SERVICES_CATALOG, PORTFOLIO_CASES, TESTIMONIALS } from '../data/siteData';
import { STATIC_ASSETS } from '../constants/assets';

export interface DataContextType {
  assets: SiteAssets;
  siteInfo: SiteMetaInfo;
  founderInfo: FounderInfo;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  leads: InquiryLead[];
  isLoading: boolean;
  isSyncingRemote: boolean;
  fetchError: string | null;
  lastSyncTime: string | null;
  syncFromRemote: () => Promise<void>;
  updateAssets: (data: Partial<SiteAssets>) => void;
  updateSiteInfo: (data: Partial<SiteMetaInfo>) => void;
  addLead: (lead: Partial<InquiryLead>) => void;
  updateFounderInfo: (data: Partial<FounderInfo>) => void;
  updateSocials: (data: Partial<FounderInfo['socials']>) => void;
  addService: (service: ServiceItem) => void;
  updateService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: string) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEYS = {
  ASSETS: 'cine_dimension_assets_v17',
  SITE_INFO: 'cine_dimension_siteinfo_v17',
  FOUNDER: 'cine_dimension_founder_v17',
  SERVICES: 'cine_dimension_services_v17',
  PORTFOLIO: 'cine_dimension_portfolio_v17',
  TESTIMONIALS: 'cine_dimension_testimonials_v17',
  LEADS: 'cinedimension_inquiries'
};

const DEFAULT_ASSETS: SiteAssets = {
  logo: STATIC_ASSETS.LOGO,
  founderImage: STATIC_ASSETS.AVATAR
};

// Helper function to sanitize and normalize brand logo URL (strictly locked to /images/logo.svg)
function sanitizeLogo(logoUrl?: string): string {
  return STATIC_ASSETS.LOGO;
}

// Helper function to sanitize and normalize founder avatar image URL (defaults to /images/avatar.jpeg)
function sanitizeFounderImage(imgUrl?: string): string {
  if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() && !imgUrl.includes('avatar.webp')) {
    return imgUrl.trim();
  }
  return STATIC_ASSETS.AVATAR;
}

const DEFAULT_SITE_INFO: SiteMetaInfo = {
  title: '維度影學 Cine Dimension',
  tagline: 'Have Fun 享受創作 ｜ 用手機拍出真實的電影感',
  email: 'select03@gmail.com',
  youtube: '@cinedimens',
  facebook: '維度影學 Cine Dimension',
  instagram: '',
  portaly: 'https://portaly.cc/cinedimension'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to safely merge portfolio
function mergePortfolioWithDefaults(remoteList: any[], defaultList: PortfolioItem[]): PortfolioItem[] {
  if (!Array.isArray(remoteList) || remoteList.length === 0) {
    return defaultList;
  }
  return remoteList.map((item, index) => ({
    id: item.id || `portfolio_${index}_${Date.now()}`,
    title: item.title || '精選專案作品',
    category: item.category || '商業動態影音',
    clientOrProject: item.clientOrProject || item.client || '',
    year: item.year || new Date().getFullYear().toString(),
    description: item.description || '',
    role: item.role || '導演 / 攝影師',
    tags: Array.isArray(item.tags) ? item.tags : ['手機攝影', '電影感視覺'],
    image: item.image || item.imageUrl || STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL,
    videoUrl: item.videoUrl || '',
    highlights: Array.isArray(item.highlights) ? item.highlights : []
  }));
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSyncingRemote, setIsSyncingRemote] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const [assets, setAssets] = useState<SiteAssets>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_ASSETS,
          ...parsed,
          logo: sanitizeLogo(parsed.logo),
          founderImage: sanitizeFounderImage(parsed.founderImage || parsed.avatar)
        };
      }
    } catch (e) {}
    return DEFAULT_ASSETS;
  });

  const [siteInfo, setSiteInfo] = useState<SiteMetaInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_INFO);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SITE_INFO;
  });

  const [founderInfo, setFounderInfo] = useState<FounderInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOUNDER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return FOUNDER_INFO;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SERVICES_CATALOG;
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return PORTFOLIO_CASES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return TESTIMONIALS;
  });

  const [leads, setLeads] = useState<InquiryLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Save changes locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    } catch (e) {}
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_INFO, JSON.stringify(siteInfo));
    } catch (e) {}
  }, [siteInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOUNDER, JSON.stringify(founderInfo));
    } catch (e) {}
  }, [founderInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    } catch (e) {}
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) {}
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {}
  }, [leads]);

  // Dynamic Runtime Data Fetching Engine (Cloudflare KV First)
  const syncFromRemote = useCallback(async () => {
    setIsSyncingRemote(true);
    setFetchError(null);

    const workerUrl = (localStorage.getItem('cms_worker_url') || '').trim().replace(/\/+$/, '');
    const token = (localStorage.getItem('cms_auth_token') || '').trim();

    const timestamp = Date.now();
    const fetchSources: { name: string; url: string; headers?: Record<string, string> }[] = [];

    // 1. Cloudflare Worker API (KV Engine - Primary Source)
    if (workerUrl) {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      fetchSources.push({
        name: 'Cloudflare Worker KV API',
        url: `${workerUrl}/api/content?_t=${timestamp}`,
        headers
      });
    }

    // 2. Relative API route (if hosted on same domain / Pages functions)
    fetchSources.push({
      name: 'Local API Proxy /api/content',
      url: `/api/content?_t=${timestamp}`
    });

    // 3. Fallback Remote Proxy endpoint
    fetchSources.push({
      name: 'Server Remote Content API',
      url: `/api/remote-content?_t=${timestamp}`
    });

    let rawData: any = null;

    for (const source of fetchSources) {
      try {
        const res = await fetch(source.url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            ...(source.headers || {})
          },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          const content = json.content || json;
          if (content && (content.portfolio || content.assets || content.siteInfo)) {
            rawData = content;
            break;
          }
        }
      } catch (err) {
        // Continue to fallback source
      }
    }

    if (rawData) {
      // A. Update Assets (Logo & Founder Avatar)
      if (rawData.assets) {
        const rawLogo = (rawData.assets.logo || '').trim();
        const newLogo = sanitizeLogo(rawLogo);
        const rawFounderImg = (rawData.assets.founderImage || rawData.assets.avatar || '').trim();
        const newFounderImg = sanitizeFounderImage(rawFounderImg);

        setAssets(prev => ({
          ...prev,
          logo: newLogo,
          founderImage: newFounderImg
        }));

        if (newFounderImg) {
          setFounderInfo(prev => ({
            ...prev,
            image: newFounderImg
          }));
        }
      }

      // B. Update Site Info & Socials
      if (rawData.siteInfo) {
        setSiteInfo(prev => ({
          ...prev,
          ...rawData.siteInfo
        }));

        if (rawData.siteInfo.email || rawData.siteInfo.youtube || rawData.siteInfo.facebook || rawData.siteInfo.portaly) {
          setFounderInfo(prev => ({
            ...prev,
            socials: {
              ...prev.socials,
              email: rawData.siteInfo.email || prev.socials.email,
              youtube: rawData.siteInfo.youtube || prev.socials.youtube,
              facebook: rawData.siteInfo.facebook || prev.socials.facebook,
              instagram: rawData.siteInfo.instagram || prev.socials.instagram,
              portaly: rawData.siteInfo.portaly || prev.socials.portaly || 'https://portaly.cc/cinedimension'
            }
          }));
        }
      }

      // C. Update Portfolio
      if (Array.isArray(rawData.portfolio) && rawData.portfolio.length > 0) {
        setPortfolio(mergePortfolioWithDefaults(rawData.portfolio, PORTFOLIO_CASES));
      }

      setLastSyncTime(new Date().toLocaleTimeString('zh-TW', { hour12: false }));
    }

    setIsSyncingRemote(false);
    setIsLoading(false);
  }, []);

  // Initial fetch on app mount
  useEffect(() => {
    syncFromRemote();

    const handleContentUpdated = () => {
      syncFromRemote();
    };

    window.addEventListener('cinedimension_content_updated', handleContentUpdated);
    window.addEventListener('storage', handleContentUpdated);

    return () => {
      window.removeEventListener('cinedimension_content_updated', handleContentUpdated);
      window.removeEventListener('storage', handleContentUpdated);
    };
  }, [syncFromRemote]);

  const updateAssets = (data: Partial<SiteAssets>) => {
    setAssets(prev => {
      const next = { ...prev, ...data };
      const newImg = data.founderImage || data.avatar;
      if (newImg) {
        next.founderImage = newImg;
        setFounderInfo(f => ({ ...f, image: newImg }));
      }
      return next;
    });
  };

  const updateSiteInfo = (data: Partial<SiteMetaInfo>) => {
    setSiteInfo(prev => ({ ...prev, ...data }));
  };

  const addLead = (lead: Partial<InquiryLead>) => {
    const newLead: InquiryLead = {
      id: `lead_${Date.now()}`,
      name: lead.name || '訪客',
      email: lead.email || '',
      phone: lead.phone || '',
      organization: lead.organization || '',
      serviceRequested: lead.serviceRequested || '未指定',
      budgetRange: lead.budgetRange || '',
      preferredTime: lead.preferredTime || '',
      message: lead.message || '',
      timestamp: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateFounderInfo = (data: Partial<FounderInfo>) => {
    setFounderInfo(prev => ({ ...prev, ...data }));
  };

  const updateSocials = (data: Partial<FounderInfo['socials']>) => {
    setFounderInfo(prev => ({
      ...prev,
      socials: { ...prev.socials, ...data }
    }));
  };

  const addService = (service: ServiceItem) => {
    setServices(prev => [...prev, service]);
  };

  const updateService = (service: ServiceItem) => {
    setServices(prev => prev.map(s => (s.id === service.id ? service : s)));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addPortfolioItem = (item: PortfolioItem) => {
    setPortfolio(prev => [item, ...prev]);
  };

  const updatePortfolioItem = (item: PortfolioItem) => {
    setPortfolio(prev => prev.map(p => (p.id === item.id ? item : p)));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [...prev, testimonial]);
  };

  const updateTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => prev.map(t => (t.id === testimonial.id ? testimonial : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const resetToDefault = () => {
    setAssets(DEFAULT_ASSETS);
    setSiteInfo(DEFAULT_SITE_INFO);
    setFounderInfo(FOUNDER_INFO);
    setServices(SERVICES_CATALOG);
    setPortfolio(PORTFOLIO_CASES);
    setTestimonials(TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.SITE_INFO);
    localStorage.removeItem(STORAGE_KEYS.FOUNDER);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
  };

  return (
    <DataContext.Provider
      value={{
        assets,
        siteInfo,
        founderInfo,
        services,
        portfolio,
        testimonials,
        leads,
        isLoading,
        isSyncingRemote,
        fetchError,
        lastSyncTime,
        syncFromRemote,
        updateAssets,
        updateSiteInfo,
        addLead,
        updateFounderInfo,
        updateSocials,
        addService,
        updateService,
        deleteService,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        resetToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const useSiteData = useData;
