import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/DataContext';
import { PortfolioItem, PageView, InquiryLead } from '../types';
import { getYouTubeThumbnailUrl, extractYouTubeVideoId } from '../utils/youtube';
import { FounderAvatar } from './FounderAvatar';
import { 
  Film, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Copy, 
  UploadCloud, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Upload, 
  Download,
  DownloadCloud,
  Save,
  Settings, 
  RefreshCw, 
  Eye, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Inbox,
  Send,
  ShieldCheck,
  Phone,
  Mail,
  User,
  Clock,
  Video
} from 'lucide-react';

interface AdminCMSProps {
  onNavigate: (view: PageView) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({ onNavigate }) => {
  const { 
    portfolio, 
    addPortfolioItem, 
    updatePortfolioItem, 
    deletePortfolioItem, 
    resetToDefault, 
    leads,
    assets,
    updateAssets,
    siteInfo,
    updateSiteInfo,
    syncFromRemote,
    isSyncingRemote,
    lastSyncTime
  } = useSiteData();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'portfolio' | 'assets' | 'siteinfo' | 'leads'>('portfolio');

  // State for Editing
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(-1);
  
  // Settings & Worker Sync State
  const [workerUrl, setWorkerUrl] = useState<string>(() => localStorage.getItem('cms_worker_url') || '');
  const [adminToken, setAdminToken] = useState<string>(() => localStorage.getItem('cms_auth_token') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const founderInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open modal for editing existing item
  const handleOpenEdit = (item: PortfolioItem, index: number) => {
    setEditingItem({ ...item });
    setModalIndex(index);
    setIsModalOpen(true);
  };

  // Open modal for new item
  const handleOpenCreate = () => {
    const newItem: PortfolioItem = {
      id: `project-${Date.now()}`,
      title: '',
      category: '商業形象片',
      clientOrProject: '',
      year: new Date().getFullYear().toString(),
      role: '導演 ｜ 攝影指導',
      description: '',
      tags: ['手機攝影', '商業廣告'],
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      videoUrl: '',
      highlights: ['實境電影感光影', '專業運鏡與節奏把控']
    };
    setEditingItem(newItem);
    setModalIndex(-1);
    setIsModalOpen(true);
  };

  // Save Modal Changes
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      showToast('請填寫作品標題', 'error');
      return;
    }

    if (modalIndex >= 0) {
      updatePortfolioItem(editingItem);
      showToast(`已成功更新作品「${editingItem.title}」`, 'success');
    } else {
      addPortfolioItem(editingItem);
      showToast(`已新增作品「${editingItem.title}」`, 'success');
    }

    setIsModalOpen(false);
  };

  // Duplicate
  const handleDuplicate = (item: PortfolioItem) => {
    const copy: PortfolioItem = {
      ...item,
      id: `project-${Date.now()}`,
      title: `${item.title} (複本)`
    };
    addPortfolioItem(copy);
    showToast(`已複製作品「${item.title}」`, 'success');
  };

  // Delete
  const handleDelete = (item: PortfolioItem) => {
    if (window.confirm(`確定要刪除「${item.title}」嗎？`)) {
      deletePortfolioItem(item.id);
      showToast(`已刪除「${item.title}」`, 'info');
    }
  };

  // Move Order
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === portfolio.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const items = [...portfolio];
    const temp = items[index];
    items[index] = items[newIndex];
    items[newIndex] = temp;

    // Update through local storage directly or sequentially
    items.forEach(p => updatePortfolioItem(p));
    showToast('已調整作品排列順序', 'success');
  };

  // Handle Client Image Upload & Compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    showToast(`正在上傳圖片 ${file.name} 至 Cloudflare R2...`, 'info');

    try {
      if (workerUrl && adminToken) {
        const apiBase = workerUrl.replace(/\/+$/, '');
        const formData = new FormData();
        formData.append('file', file, file.name);

        const res = await fetch(`${apiBase}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          },
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'R2 上傳失敗');
        }

        const newImageUrl = data.url || data.rawUrl;
        setEditingItem({ ...editingItem, image: newImageUrl });
        showToast('✨ 圖片已成功上傳至 Cloudflare R2！', 'success');
      } else {
        const localUrl = URL.createObjectURL(file);
        setEditingItem({ ...editingItem, image: localUrl });
        showToast('圖片已套用本機即時預覽！', 'success');
      }
    } catch (err: any) {
      showToast(`上傳提示：${err.message}`, 'error');
    } finally {
      e.target.value = '';
    }
  };

  // Handle Single Asset Upload (Logo / Founder Image)
  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'logo' | 'founderImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast(`正在上傳素材 ${file.name} 至 Cloudflare R2...`, 'info');

    try {
      if (workerUrl && adminToken) {
        const apiBase = workerUrl.replace(/\/+$/, '');
        const formData = new FormData();
        formData.append('file', file, file.name);

        const res = await fetch(`${apiBase}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          },
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'R2 上傳失敗');
        }

        const newImageUrl = data.url || data.rawUrl;
        if (key === 'founderImage') {
          updateAssets({ founderImage: newImageUrl, avatar: newImageUrl });
        } else {
          updateAssets({ [key]: newImageUrl });
        }
        showToast(`🎉 ${key === 'logo' ? 'Logo' : '創辦人肖像'} 已成功上傳至 Cloudflare R2！請點擊右上角「一鍵發佈」保存`, 'success');
      } else {
        const localUrl = URL.createObjectURL(file);
        if (key === 'founderImage') {
          updateAssets({ founderImage: localUrl, avatar: localUrl });
        } else {
          updateAssets({ [key]: localUrl });
        }
        showToast(`🎉 ${key === 'logo' ? 'Logo' : '創辦人肖像'} 已套用即時預覽！請點擊右上角「一鍵發佈」保存`, 'success');
      }
    } catch (err: any) {
      showToast(`素材上傳提示：${err.message}`, 'error');
    } finally {
      e.target.value = '';
    }
  };

  // Test Telegram Bot Push via Worker
  const handleTestTelegramBot = async () => {
    setIsTestingTelegram(true);
    try {
      const apiEndpoint = workerUrl ? `${workerUrl.replace(/\/+$/, '')}/api/test-telegram` : '/api/submit-form';
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '測試預約者 (悟哥)',
          email: 'test@cine-dimension.com',
          phone: '0912-345-678',
          organization: '維度影學測試團隊',
          serviceType: '【系統測試】Telegram Bot 預約通知連線',
          budgetRange: 'NT$ 30,000 - 80,000',
          preferredTime: '即時推播測試',
          message: '這是一則由維度影學 CMS 發送的測試預約單據！'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('✅ Telegram 測試推播已發送！請至 Telegram 頻道查看。', 'success');
      } else {
        showToast(`Telegram 測試回傳：${data.error || '未完成發送'}`, 'error');
      }
    } catch (err: any) {
      showToast(`發送測試失敗：${err.message}`, 'error');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // Publish content directly to Cloudflare KV via Worker
  const handlePublishToCloudflareKV = async () => {
    if (!workerUrl) {
      setIsSettingsOpen(true);
      showToast('請先在設定中輸入 Cloudflare Worker 網址', 'error');
      return;
    }

    setIsPublishing(true);
    const apiBase = workerUrl.replace(/\/+$/, '');

    const resolvedLogo = assets.logo && assets.logo.trim() ? assets.logo.trim() : 'https://assets.cine-dimension.com/Logo.svg';
    const resolvedFounder = assets.founderImage && assets.founderImage.trim() ? assets.founderImage.trim() : 'https://assets.cine-dimension.com/avatar.JPG';

    const payload = {
      content: {
        siteInfo: {
          ...siteInfo,
          logoUrl: resolvedLogo
        },
        site: {
          ...siteInfo,
          logoUrl: resolvedLogo
        },
        assets: {
          ...assets,
          logo: resolvedLogo,
          founderImage: resolvedFounder
        },
        portfolio
      },
      message: `[CMS] 更新視覺素材與 ${portfolio.length} 筆作品集 (${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })})`
    };

    try {
      const res = await fetch(`${apiBase}/api/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Cloudflare KV 儲存失敗');
      }

      window.dispatchEvent(new Event('cinedimension_content_updated'));
      showToast('🎉 發佈成功！資料已安全寫入 Cloudflare KV，前台即時動態生效！', 'success');
    } catch (err: any) {
      showToast(`Cloudflare KV 發佈失敗：${err.message}`, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs flex items-center gap-2 backdrop-blur-md transition-all ${
          toastMessage.type === 'success' ? 'bg-emerald-950/95 border-emerald-700 text-emerald-200' :
          toastMessage.type === 'error' ? 'bg-rose-950/95 border-rose-700 text-rose-200' :
          'bg-slate-900/95 border-slate-700 text-slate-200'
        }`}>
          {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toastMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Navigation Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="bg-[#141720] border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">維度影學 CMS 內容管理後台</h1>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  {portfolio.length} 項作品 ｜ {leads.length} 筆預約單
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-0.5">
                支援作品集、Logo/肖像素材、基本資訊與預約單據推播測試，直存 Cloudflare KV
                {lastSyncTime && <span className="text-slate-500 ml-2">(最後同步: {lastSyncTime})</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Sync Remote Button */}
            <button
              onClick={() => {
                showToast('正在從 Cloudflare KV 重新同步最新資料...', 'info');
                syncFromRemote().then(() => showToast('已成功從 KV 雲端同步最新內容！', 'success'));
              }}
              disabled={isSyncingRemote}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="強制從 Cloudflare KV 重新同步"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncingRemote ? 'animate-spin' : ''}`} />
              <span>{isSyncingRemote ? '同步中...' : '從 KV 雲端同步'}</span>
            </button>

            {/* View Live Site Button */}
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>前台首頁</span>
            </button>

            {/* Worker Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Cloudflare Worker 與 Telegram 設定"
            >
              <Settings className="w-4 h-4 text-amber-400" />
            </button>

            {/* Publish Button */}
            <button
              onClick={handlePublishToCloudflareKV}
              disabled={isPublishing}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span>一鍵發佈至 Cloudflare KV</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>作品集管理 ({portfolio.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'assets'
                ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>核心素材 (Logo & 肖像)</span>
          </button>

          <button
            onClick={() => setActiveTab('siteinfo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'siteinfo'
                ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>網站資訊設定</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>預約諮詢名單 ({leads.length})</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: PORTFOLIO MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>現有作品集項目列表</span>
                </h2>
                <p className="text-xs text-slate-400">點擊下方任一作品的「編輯」即可即時修改文字與更換圖片</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefault}
                  className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-xl text-xs transition-colors"
                >
                  重設為預設 6 大作品
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>新增作品</span>
                </button>
              </div>
            </div>

            {/* Portfolio Items Cards List */}
            <div className="space-y-3.5">
              {portfolio.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-[#141720] hover:bg-[#181c26] border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-md group"
                >
                  {/* Left Item Meta */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    
                    <span className="w-6 text-center font-mono text-xs font-bold text-slate-500 shrink-0">
                      #{index + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative flex items-center justify-center">
                      {(item.image || getYouTubeThumbnailUrl(item.videoUrl)) ? (
                        <img 
                          src={item.image || getYouTubeThumbnailUrl(item.videoUrl) || ''} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const ytThumb = getYouTubeThumbnailUrl(item.videoUrl);
                            if (ytThumb && e.currentTarget.src !== ytThumb) {
                              e.currentTarget.src = ytThumb;
                            }
                          }}
                        />
                      ) : (
                        <Film className="w-6 h-6 text-slate-700" />
                      )}
                      {item.videoUrl && (
                        <span className="absolute bottom-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                          ▶ 影音
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                          {item.year || '2024'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                        {item.clientOrProject && (
                          <span className="text-xs text-slate-500 hidden sm:inline">· {item.clientOrProject}</span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {item.role && <span className="text-amber-400/90 font-medium">{item.role} ｜ </span>}
                        {item.description}
                      </p>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-1.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 shrink-0">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg text-xs disabled:opacity-20 transition-colors"
                      title="向上移"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === portfolio.length - 1}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg text-xs disabled:opacity-20 transition-colors"
                      title="向下移"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(item, index)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      title="編輯此作品"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>編輯內容</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(item)}
                      className="p-2 text-slate-400 hover:text-sky-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                      title="複製"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 rounded-lg text-xs transition-colors"
                      title="刪除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: ASSETS MANAGEMENT (LOGO & AVATAR) */}
        {/* ========================================== */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="bg-[#141720] border border-slate-800/80 p-4 rounded-2xl space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>品牌 Logo 與代表形象肖像管理</span>
              </h2>
              <p className="text-xs text-slate-400">上傳更換後將即時同步於前台頂部導覽列、創辦人簡介與頁尾</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Asset 1: Brand Logo */}
              <div className="bg-[#141720] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>品牌 Logo 標誌</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">JPG / PNG / SVG</span>
                </div>

                <div className="h-40 bg-[#0c0e13] border border-slate-800 rounded-xl flex items-center justify-center p-4 relative group overflow-hidden">
                  <img
                    src={assets.logo || 'https://assets.cine-dimension.com/Logo.svg'}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-3">
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleAssetUpload(e, 'logo')} 
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => logoInputRef.current?.click()}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>選擇 Logo 圖片上傳</span>
                    </button>
                    <button
                      onClick={() => updateAssets({ logo: 'https://assets.cine-dimension.com/Logo.svg' })}
                      className="px-3 py-2 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 text-rose-300 rounded-xl text-xs transition-colors"
                      title="還原為 R2 官方預設 Logo (Logo.svg)"
                    >
                      還原預設
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">網站 Logo 網址 (URL)：</label>
                    <input 
                      type="text" 
                      value={assets.logo || 'https://assets.cine-dimension.com/Logo.svg'} 
                      placeholder="https://assets.cine-dimension.com/Logo.svg" 
                      onChange={(e) => updateAssets({ logo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#191d27] border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Asset 2: Founder / Portrait Image */}
              <div className="bg-[#141720] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>創辦人形象肖像 (Avatar)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">直式或方形 JPG/PNG</span>
                </div>

                <div className="h-40 bg-[#0c0e13] border border-slate-800 rounded-xl flex items-center justify-center p-4 relative group overflow-hidden">
                  <FounderAvatar 
                    src={assets.founderImage || 'https://assets.cine-dimension.com/avatar.JPG'} 
                    alt="Founder Preview" 
                    className="max-h-full max-w-full object-contain rounded-lg" 
                  />
                </div>

                <div className="space-y-3">
                  <input 
                    type="file" 
                    ref={founderInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleAssetUpload(e, 'founderImage')} 
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => founderInputRef.current?.click()}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>選擇肖像圖片上傳</span>
                    </button>
                    <button
                      onClick={() => updateAssets({ founderImage: 'https://assets.cine-dimension.com/avatar.JPG', avatar: 'https://assets.cine-dimension.com/avatar.JPG' })}
                      className="px-3 py-2 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 text-rose-300 rounded-xl text-xs transition-colors"
                      title="還原為 R2 官方預設肖像"
                    >
                      還原預設
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">創辦人形象照網址 (URL)：</label>
                    <input 
                      type="text" 
                      value={assets.founderImage || 'https://assets.cine-dimension.com/avatar.JPG'} 
                      placeholder="https://assets.cine-dimension.com/avatar.JPG" 
                      onChange={(e) => updateAssets({ founderImage: e.target.value, avatar: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#191d27] border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: SITE INFO SETTINGS */}
        {/* ========================================== */}
        {activeTab === 'siteinfo' && (
          <div className="space-y-6">
            <div className="bg-[#141720] border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>基本品牌資訊與標語</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">網站品牌名稱</label>
                  <input 
                    type="text" 
                    value={siteInfo.title || ''} 
                    onChange={(e) => updateSiteInfo({ title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">聯絡信箱 (Email)</label>
                  <input 
                    type="email" 
                    value={siteInfo.email || ''} 
                    onChange={(e) => updateSiteInfo({ email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">核心標語 / Slogan</label>
                <input 
                  type="text" 
                  value={siteInfo.tagline || ''} 
                  onChange={(e) => updateSiteInfo({ tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Social Links & Portals */}
            <div className="bg-[#141720] border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">官方社群與傳送門連結</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Portaly 傳送門 (個人線上課程 / 免費資源下載)</label>
                  <input 
                    type="text" 
                    value={siteInfo.portaly || ''} 
                    onChange={(e) => updateSiteInfo({ portaly: e.target.value })}
                    placeholder="https://portaly.cc/cinedimension"
                    className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">YouTube 頻道</label>
                  <input 
                    type="text" 
                    value={siteInfo.youtube || ''} 
                    onChange={(e) => updateSiteInfo({ youtube: e.target.value })}
                    placeholder="@cinedimens"
                    className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Facebook 粉絲團</label>
                  <input 
                    type="text" 
                    value={siteInfo.facebook || ''} 
                    onChange={(e) => updateSiteInfo({ facebook: e.target.value })}
                    placeholder="維度影學 Cine Dimension"
                    className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Instagram 帳號</label>
                  <input 
                    type="text" 
                    value={siteInfo.instagram || ''} 
                    onChange={(e) => updateSiteInfo({ instagram: e.target.value })}
                    placeholder="例如：cinedimension_official"
                    className="w-full px-3 py-2 bg-[#191d27] border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: LEADS & TELEGRAM TESTING */}
        {/* ========================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            {/* Telegram Instant Test Box */}
            <div className="bg-[#141720] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Telegram Bot 即時通知連線測試</span>
                </h3>
                <p className="text-xs text-slate-400">
                  送出一筆測試預約單據至您的 Telegram 頻道，驗證 Bot Token 與 Chat ID 設定是否運作正常。
                </p>
              </div>

              <button
                onClick={handleTestTelegramBot}
                disabled={isTestingTelegram}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all disabled:opacity-50 shrink-0"
              >
                {isTestingTelegram ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>發送 Telegram 測試通知</span>
              </button>
            </div>

            {/* Leads List */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                <span>預約名單紀錄（共 {leads.length} 筆）</span>
              </h3>

              {leads.length === 0 ? (
                <div className="bg-[#141720] border border-slate-800 rounded-2xl p-10 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">目前尚無預約單據紀錄</p>
                  <p className="text-xs text-slate-500">當訪客在前台送出預約諮詢表單後，將會自動在此處即時列出並推播至 Telegram。</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead, idx) => (
                    <div key={lead.id || idx} className="bg-[#141720] border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-amber-400" />
                            {lead.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">({lead.phone})</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {lead.driveStatus || '已即時接收'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{lead.timestamp || '剛剛'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300">
                        <div><span className="text-slate-500">Email：</span>{lead.email}</div>
                        <div><span className="text-slate-500">單位：</span>{lead.organization || '個人'}</div>
                        <div><span className="text-slate-500">服務：</span>{lead.serviceType || lead.serviceRequested}</div>
                        <div><span className="text-slate-500">預算：</span>{lead.budgetRange || '未填寫'}</div>
                      </div>

                      {lead.message && (
                        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                          <span className="text-slate-500 font-semibold">需求內容：</span>
                          <p className="whitespace-pre-line leading-relaxed">{lead.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* FULL PORTFOLIO EDIT MODAL */}
      {/* ========================================== */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#141822] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>{modalIndex >= 0 ? `編輯作品：${editingItem.title}` : '新增作品項目'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">作品名稱 *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="例如：Shell 喜力汽車年度形象片"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">分類類別 *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="例如：商業形象片 / 音樂MV / 婚禮電影"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">製作年份</label>
                  <input
                    type="text"
                    value={editingItem.year}
                    onChange={e => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="例如：2024"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">擔任職掌 (Role)</label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={e => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="例如：導演 ｜ 攝影指導"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">專案客戶 / 出品方</label>
                  <input
                    type="text"
                    value={editingItem.clientOrProject}
                    onChange={e => setEditingItem({ ...editingItem, clientOrProject: e.target.value })}
                    placeholder="例如：台灣殼牌 Shell"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">作品簡介與敘事重點</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="簡述專案亮點、拍攝手法或客戶成果..."
                  className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">標籤 Tags (以逗號分隔)</label>
                  <input
                    type="text"
                    value={editingItem.tags ? editingItem.tags.join(', ') : ''}
                    onChange={e => setEditingItem({ 
                      ...editingItem, 
                      tags: e.target.value.split(/[,，]/).map(t => t.trim()).filter(Boolean) 
                    })}
                    placeholder="例如：手機攝影, 商業廣告, 節奏剪輯"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-slate-400">YouTube / 影音播放連結 (可選)</label>
                    {editingItem.videoUrl && extractYouTubeVideoId(editingItem.videoUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          const ytThumb = getYouTubeThumbnailUrl(editingItem.videoUrl);
                          if (ytThumb) {
                            setEditingItem({ ...editingItem, image: ytThumb });
                            showToast('已成功抓取 YouTube 影片縮圖！', 'success');
                          }
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>抓取 YouTube 縮圖為封面</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={editingItem.videoUrl || ''}
                    onChange={e => {
                      const newVideoUrl = e.target.value;
                      const ytThumb = getYouTubeThumbnailUrl(newVideoUrl);
                      // If image is empty or was previous youtube thumb, auto update
                      if (ytThumb && (!editingItem.image || editingItem.image.includes('img.youtube.com'))) {
                        setEditingItem({ ...editingItem, videoUrl: newVideoUrl, image: ytThumb });
                      } else {
                        setEditingItem({ ...editingItem, videoUrl: newVideoUrl });
                      }
                    }}
                    placeholder="例如：https://youtu.be/_JjmH05QYlU"
                    className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">專案亮點 (Highlights，每行一條)</label>
                <textarea
                  rows={2}
                  value={editingItem.highlights ? editingItem.highlights.join('\n') : ''}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    highlights: e.target.value.split('\n').map(h => h.trim()).filter(Boolean)
                  })}
                  placeholder="例如：
輔導超過 50 位青農產出自家水果短影片
滿意度高達 98%，學員觸及率提升顯著"
                  className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Cover Image Upload & Input */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs text-slate-300 font-semibold">代表封面圖片 (Cover Image)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="w-28 h-20 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {editingItem.image ? (
                      <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-slate-600">無圖片</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageFileChange} 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>選擇新圖片上傳</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editingItem.image}
                      onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                      placeholder="或直接輸入圖片 URL (https://...)"
                      className="w-full px-3 py-1.5 bg-[#1a1e28] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>儲存作品內容</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* WORKER SETTINGS MODAL */}
      {/* ========================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141822] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Cloudflare Worker 與 Telegram 設定</span>
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Cloudflare KV Dynamic Sync Tools */}
              <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Cloudflare KV 雲端資料同步</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                    KV 雲端直存
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  本系統已全面改用 Cloudflare KV 雲端資料庫（Key: <code className="text-amber-300">site_content</code>）儲存，不再向 GitHub 進行 Commit。點擊下方按鈕可強制從 KV 讀取最新前台設定。
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      showToast('正在從 Cloudflare KV 拉取最新資料...', 'info');
                      await syncFromRemote();
                      showToast('✅ 成功同步最新遠端內容！', 'success');
                    }}
                    className="w-full px-3 py-2 bg-amber-600/90 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>立即從 Cloudflare KV 重新整理</span>
                  </button>
                </div>
              </div>

              {/* Worker URL & Token */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Worker 代理公開網址：</label>
                <input
                  type="url"
                  value={workerUrl}
                  onChange={e => {
                    setWorkerUrl(e.target.value);
                    localStorage.setItem('cms_worker_url', e.target.value.trim());
                  }}
                  placeholder="https://cinedimension-cms.yourname.workers.dev"
                  className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">管理員 Token (可選)：</label>
                <input
                  type="password"
                  value={adminToken}
                  onChange={e => {
                    setAdminToken(e.target.value);
                    localStorage.setItem('cms_auth_token', e.target.value.trim());
                  }}
                  placeholder="登入後自動簽發之 Token"
                  className="w-full px-3 py-2 bg-[#1a1e28] border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5 text-slate-400">
                <p className="font-semibold text-slate-300">💡 說明：</p>
                <p>• 部署 Cloudflare Worker (`worker.js`) 並綁定 KV Namespace (`SITE_KV`) 後，後台發佈將直寫 KV。</p>
                <p>• GitHub 僅負責網頁原始碼，AI Studio 開發推送程式碼時完全不會與後台資料產生 Git 衝突。</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
              >
                完成
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/**
 * Client-Side Image Compressor
 */
function fileToCompressedBase64(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const isSvg = file.type === 'image/svg+xml' || (file.name && file.name.toLowerCase().endsWith('.svg'));
    
    if (isSvg) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const res = e.target?.result;
          if (typeof res === 'string' && res.startsWith('data:')) {
            resolve(res);
          } else {
            const text = typeof res === 'string' ? res : new TextDecoder().decode(res as ArrayBuffer);
            const base64 = btoa(unescape(encodeURIComponent(text)));
            resolve(`data:image/svg+xml;base64,${base64}`);
          }
        } catch {
          const directReader = new FileReader();
          directReader.onload = () => resolve(directReader.result as string);
          directReader.onerror = reject;
          directReader.readAsDataURL(file);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    if (file.size < 300 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(e.target?.result as string);
        
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
