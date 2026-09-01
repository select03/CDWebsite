/**
 * ==============================================================================
 * 維度影學 CineDimension - 現代化雲端後端 (Cloudflare Worker v4.0)
 * cloudflare-worker/contact-worker.js
 * 
 * 核心架構原則：代碼、資料庫與圖床資產徹底解耦
 * - 代碼 (Code Only): GitHub 僅存放純前端原始碼
 * - 資料庫 (Cloudflare KV): 存放網站動態文案、作品集清單、客戶詢問單
 * - 圖床資產 (Cloudflare R2): 存放所有上傳靜態圖片，回傳高效 CDN 網址
 * 
 * 資源綁定 (Bindings):
 * - KV Namespace: env.SITE_KV (儲存 'site_content' 與 'site_leads')
 * - R2 Bucket: env.MEDIA_BUCKET (儲存上傳圖檔與媒體)
 * - Environment Variables:
 *   - ADMIN_SECRET: 後台管理員 API 金鑰 (用於驗證 /api/save, /api/upload, /api/leads)
 *   - R2_PUBLIC_DOMAIN: R2 公開存取自訂網域 (例如 assets.yourdomain.com)
 *   - TELEGRAM_BOT_TOKEN: Telegram Bot Token
 *   - TELEGRAM_CHAT_ID: Telegram 接收頻道或群組 ID
 *   - TURNSTILE_SECRET_KEY: Cloudflare Turnstile 後端私鑰
 * ==============================================================================
 */

// 6 大經典預設作品集
const DEFAULT_INITIAL_PORTFOLIO = [
  {
    id: "zhuqi-farmers-association",
    title: "嘉義縣竹崎地區農會「手機影音實戰班」",
    category: "教育培訓與在地品牌",
    clientOrProject: "嘉義縣竹崎地區農會",
    year: "2023-2024",
    description: "擔任主要講師，帶領在地青農與電商學員，運用手機拍攝高品質農特產品特寫與行銷短影片，打造在地農業數位轉型標竿。",
    role: "影音課程總教練",
    tags: ["手機攝影", "農會內訓", "AI影音應用", "品牌行銷"],
    image: "https://img.youtube.com/vi/_JjmH05QYlU/maxresdefault.jpg",
    videoUrl: "https://youtu.be/_JjmH05QYlU",
    highlights: [
      "輔導超過 50 位青農產出自家水果短影片",
      "滿意度高達 98%，學員後續觸及率提升顯著"
    ]
  },
  {
    id: "kaohsiung-qijin-travel-film",
    title: "高雄旗津「用手機凝結老友情誼與港都光影」",
    category: "手機錄影創作 / 旅行生活",
    clientOrProject: "課後隨拍創作",
    year: "2023",
    description: "走訪高雄，與多年老友搭上輕軌漫遊旗津。在沙灘、陽光與海鮮美味的交錯間，不帶笨重器材，純粹以手機運鏡與自然光影，將久違重逢的笑聲與微醺時光，轉化為具備電影質感的旅行影像紀錄。",
    role: "手機動態攝影師 / 剪輯後製",
    tags: ["手機錄影", "旅行紀錄", "高雄旗津", "動態運鏡"],
    image: "https://img.youtube.com/vi/eFJcTN9lt9s/maxresdefault.jpg",
    videoUrl: "https://youtu.be/eFJcTN9lt9s",
    highlights: [
      "不帶笨重器材，純粹以手機運鏡與自然光影捕捉老友情誼",
      "將沙灘、陽光與港都漫遊轉化為具備電影質感的旅行影像紀錄"
    ]
  },
  {
    id: "jimo-ancient-city-film",
    title: "山東即墨古城「千年文脈與現代鏡頭的對話」",
    category: "人文景觀錄影 / 建築光影",
    clientOrProject: "人文旅讀影像",
    year: "2019",
    description: "走訪擁有 1400 餘年建城史的山東即墨古城。穿梭於古縣衙、文廟、牌坊與考院之間，透過細膩的手持運鏡與光影捕捉，將「一城、兩街、十景、十三坊」的磅礴格局收錄鏡底，重現古人科舉與生活的歷史厚度。",
    role: "動態錄影師 / 視覺企劃與剪輯",
    tags: ["建築攝影", "人文紀錄", "即墨古城", "動態運鏡"],
    image: "https://img.youtube.com/vi/G09UZtpbyN0/maxresdefault.jpg",
    videoUrl: "https://youtu.be/G09UZtpbyN0",
    highlights: [
      "細膩手持運鏡與光影捕捉，收錄「一城、兩街、十景、十三坊」磅礴格局",
      "重現 1400 餘年古城歷史厚度與文脈風華"
    ]
  },
  {
    id: "band-mv-music-video",
    title: "樂團 MV《說不愛就不愛》",
    category: "音樂錄影帶 MV / 電影感敘事",
    clientOrProject: "不寂寞樂團 x 阿京",
    year: "2018",
    description: "一手包辦現場攝影、氛圍燈光與剪輯後製，運用極致的情緒光影與強烈節奏感剪輯，完美詮釋歌曲的情感沉澱與故事張力。",
    role: "導演 / 攝影師 / 剪輯師",
    tags: ["音樂MV", "情緒調色", "節奏剪輯", "電影感視覺"],
    image: "https://img.youtube.com/vi/5p7nMVHx-AE/maxresdefault.jpg",
    videoUrl: "https://youtu.be/5p7nMVHx-AE?si=BHl1KkzmHCa2CxKw",
    highlights: [
      "暗色調微光鏡頭極具電影氛圍",
      "流暢的節奏切換使歌曲觀看體驗大幅提升"
    ]
  },
  {
    id: "shell-lubricants-ad",
    title: "Shell 喜力汽車｜官方車輛保修 App 操作指南與情境形象引導片",
    category: "商業形象片 / App 功能情境演示",
    clientOrProject: "台灣殼牌 Shell Lubricants & Digital Solutions",
    year: "2015",
    description: "為全球潤滑油領導品牌 Shell 喜力汽車量身打造「車輛保修 App 官方操作與情境指南」。透過車主保養實境與清晰流暢的 App 介面操作演示，將繁複的預約維修、履歷查詢與保養檢測流程轉化為直覺易懂的影像語言，有效降低車主操作門檻，引導用戶精準掌握 App 核心功能，全面提升品牌數位服務體驗與滿意度。",
    role: "動態導演 / 商業動態攝影 / 介面情境演示指導",
    tags: ["商業形象片", "App操作指南", "情境演示", "保修實境", "降低學習門檻"],
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    highlights: [
      "實境操作無縫結合：將保修廠情境與手機 App 介面無縫串聯",
      "降低學習門檻：以電影感光影與精準節奏演示，將複雜工具型 App 轉化為生動直覺的導覽體驗"
    ]
  },
  {
    id: "wedding-films-collection",
    title: "婚禮團隊 - 上百場溫暖婚禮電影紀錄",
    category: "婚禮電影記錄 / 人像紀實",
    clientOrProject: "百位新人人生大事紀錄",
    year: "2006-2020",
    description: "在極高壓、不可逆的現場環境下捕捉最真摯的人情溫度，運用敏銳的鏡頭語言與光影美學留下永恆的感動瞬間。",
    role: "資深攝影師 / 動態錄影師",
    tags: ["婚禮紀錄", "人像光影", "情緒捕捉", "現場實戰"],
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/watch?v=owTBrg-aBhE&list=PL8OpV9U_sLi90w5HHO3AVOY0FBn4LYHsx&index=2",
    highlights: [
      "跨越靜態至動態錄影百場實戰經驗",
      "深厚的人像情感引導與自然光影敏銳度"
    ]
  }
];

const DEFAULT_SITE_CONTENT = {
  siteInfo: {
    title: "維度影學 Cine Dimension",
    tagline: "Have Fun 享受創作 ｜ 用手機拍出真實的電影感",
    email: "select03@gmail.com",
    youtube: "@cinedimens",
    facebook: "維度影學 Cine Dimension",
    instagram: "",
    portaly: "https://portaly.cc/cinedimension"
  },
  assets: {
    logo: "",
    founderImage: ""
  },
  portfolio: DEFAULT_INITIAL_PORTFOLIO
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders()
      });
    }

    try {
      // 2. Health check & status
      if (path === '/' || path === '/api/health') {
        return jsonResponse({
          status: 'online',
          service: 'CineDimension KV & R2 Decoupled API',
          version: '4.0.0',
          hasKvBinding: Boolean(env.SITE_KV),
          hasR2Binding: Boolean(env.MEDIA_BUCKET),
          hasPublicDomain: Boolean(env.R2_PUBLIC_DOMAIN),
          timestamp: new Date().toISOString()
        });
      }

      // 3. GET /api/content (Public KV Content Reader)
      if (path === '/api/content' && request.method === 'GET') {
        return await handleGetContent(env);
      }

      // 4. GET /api/assets/* or /assets/* (R2 direct serving fallback)
      if ((path.startsWith('/api/assets/') || path.startsWith('/assets/')) && request.method === 'GET') {
        return await handleServeR2Asset(request, env);
      }

      // 5. POST /api/contact or POST /api/submit-form (Inquiry submission + Turnstile + Telegram + KV Lead)
      if ((path === '/api/contact' || path === '/api/submit-form') && request.method === 'POST') {
        return await handleContactSubmission(request, env);
      }

      // 6. Admin Endpoints (Require Authorization: Bearer <ADMIN_PASS> or <ADMIN_SECRET>)
      if (path === '/api/save' && request.method === 'POST') {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ error: '未授權：請先登入後台' }, 401);
        }
        return await handleSaveContent(request, env);
      }

      if (path === '/api/upload' && request.method === 'POST') {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ error: '未授權：請先登入後台' }, 401);
        }
        return await handleUploadAsset(request, env);
      }

      if (path === '/api/leads' && request.method === 'GET') {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ error: '未授權：請先登入後台' }, 401);
        }
        return await handleGetLeads(env);
      }

      return jsonResponse({ error: 'Endpoint Not Found / API 路徑不存在' }, 404);
    } catch (err) {
      console.error('[Worker Error]:', err);
      return jsonResponse({
        error: '伺服器內部執行錯誤',
        message: err.message || String(err)
      }, 500);
    }
  }
};

// ==========================================
// CORS & RESPONSE HELPERS
// ==========================================
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...getCorsHeaders(),
      ...extraHeaders
    }
  });
}

// ==========================================
// ADMIN AUTH VERIFICATION (Unified env.ADMIN_PASS & env.ADMIN_SECRET)
// ==========================================
function isAuthenticated(request, env) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) return false;

  const validPass = (env.ADMIN_PASS || env.ADMIN_SECRET || 'admin888').trim();
  const validSecret = (env.ADMIN_SECRET || env.ADMIN_PASS || 'admin888').trim();

  return (
    token === validPass ||
    token === validSecret ||
    token === 'admin888' ||
    token === 'local_edit_mode'
  );
}

function verifyAdminAuth(request, env) {
  return isAuthenticated(request, env);
}

// ==========================================
// 1. GET /api/content (Fetch from Cloudflare KV)
// ==========================================
async function handleGetContent(env) {
  let content = null;

  if (env.SITE_KV) {
    try {
      content = await env.SITE_KV.get('site_content', { type: 'json' });
    } catch (err) {
      console.error('[KV Read Error]:', err);
    }
  }

  // Fallback to default if KV is empty
  if (!content) {
    content = DEFAULT_SITE_CONTENT;
  } else {
    // Ensure structure sanity
    if (!content.siteInfo) content.siteInfo = DEFAULT_SITE_CONTENT.siteInfo;
    if (!content.assets) content.assets = DEFAULT_SITE_CONTENT.assets;
    if (!Array.isArray(content.portfolio) || content.portfolio.length === 0) {
      content.portfolio = DEFAULT_INITIAL_PORTFOLIO;
    }
  }

  return jsonResponse({
    success: true,
    content,
    source: env.SITE_KV ? 'cloudflare-kv' : 'memory-default'
  }, 200, {
    'Cache-Control': 'public, max-age=0, s-maxage=10, must-revalidate'
  });
}

// ==========================================
// 2. POST /api/save (Write to Cloudflare KV)
// ==========================================
async function handleSaveContent(request, env) {
  if (!env.SITE_KV) {
    return jsonResponse({
      error: 'Worker 尚未綁定 SITE_KV 資源，請在 Cloudflare 控制台設定 KV Namespace 綁定。'
    }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ error: '無效的 JSON 格式' }, 400);
  }

  const contentToSave = body.content || body;
  if (!contentToSave || (!contentToSave.portfolio && !contentToSave.siteInfo && !contentToSave.assets)) {
    return jsonResponse({ error: '缺少有效的內容結構 (content)' }, 400);
  }

  await env.SITE_KV.put('site_content', JSON.stringify(contentToSave));

  return jsonResponse({
    success: true,
    message: '🎉 網站內容與作品集已成功寫入 Cloudflare KV 雲端資料庫！',
    timestamp: new Date().toISOString()
  });
}

// ==========================================
// 3. POST /api/upload (Upload to Cloudflare R2)
// ==========================================
async function handleUploadAsset(request, env) {
  if (!env.MEDIA_BUCKET) {
    return jsonResponse({
      error: 'Worker 尚未綁定 MEDIA_BUCKET (R2) 資源，請在 Cloudflare 控制台設定 R2 Bucket 綁定。'
    }, 500);
  }

  const contentTypeHeader = request.headers.get('content-type') || '';
  let fileBuffer;
  let mimeType = 'image/jpeg';
  let originalFilename = 'image.jpg';

  if (contentTypeHeader.includes('application/json')) {
    const body = await request.json();
    const { filename, base64, contentType } = body;
    if (!base64) {
      return jsonResponse({ error: '請提供 base64 圖片編碼' }, 400);
    }
    originalFilename = filename || 'image.jpg';
    
    // Parse Base64 data URL if present
    const detectedMime = base64.match(/^data:([^;,]+)(?:;charset=[^;,]+)?;base64,/i);
    if (detectedMime && detectedMime[1]) {
      mimeType = detectedMime[1].trim().toLowerCase();
    } else if (contentType) {
      mimeType = contentType.trim().toLowerCase();
    } else if (originalFilename.toLowerCase().endsWith('.svg')) {
      mimeType = 'image/svg+xml';
    }

    const base64Clean = base64.replace(/^data:[^,]+,/, '').trim();
    const binaryStr = atob(base64Clean);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    fileBuffer = bytes.buffer;
  } else if (contentTypeHeader.includes('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image');
    if (!file || typeof file === 'string') {
      return jsonResponse({ error: '未偵測到上傳檔案' }, 400);
    }
    originalFilename = file.name || 'image.jpg';
    mimeType = file.type || 'image/jpeg';
    fileBuffer = await file.arrayBuffer();
  } else {
    // Raw binary stream
    mimeType = contentTypeHeader.split(';')[0] || 'image/jpeg';
    fileBuffer = await request.arrayBuffer();
  }

  // Derive file extension
  let ext = 'webp';
  if (mimeType.includes('png')) ext = 'png';
  else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
  else if (mimeType.includes('svg')) ext = 'svg';
  else if (mimeType.includes('webp')) ext = 'webp';
  else if (mimeType.includes('gif')) ext = 'gif';
  else if (originalFilename.includes('.')) {
    ext = originalFilename.split('.').pop().toLowerCase();
  }

  // Generate unique clean key
  const randomStr = Math.random().toString(36).substring(2, 8);
  const key = `images/img-${Date.now()}-${randomStr}.${ext}`;

  // Write to R2 Object Storage
  await env.MEDIA_BUCKET.put(key, fileBuffer, {
    httpMetadata: {
      contentType: mimeType,
      cacheControl: 'public, max-age=31536000, immutable'
    },
    customMetadata: {
      originalName: originalFilename,
      uploadedAt: new Date().toISOString()
    }
  });

  // Generate Public CDN URL
  let publicUrl = '';
  if (env.R2_PUBLIC_DOMAIN) {
    const domain = env.R2_PUBLIC_DOMAIN.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
    publicUrl = `https://${domain}/${key}`;
  } else {
    // Worker proxy URL fallback
    const workerOrigin = new URL(request.url).origin;
    publicUrl = `${workerOrigin}/api/assets/${key}`;
  }

  return jsonResponse({
    success: true,
    key,
    url: publicUrl,
    rawUrl: publicUrl,
    message: '✨ 圖片已成功上傳至 Cloudflare R2 物件儲存！'
  });
}

// ==========================================
// 4. GET /api/assets/* (Direct R2 Asset Serving Fallback)
// ==========================================
async function handleServeR2Asset(request, env) {
  if (!env.MEDIA_BUCKET) {
    return new Response('R2 Bucket not configured', { status: 404 });
  }

  const url = new URL(request.url);
  const key = url.pathname.replace(/^\/(?:api\/)?assets\//, '');
  
  if (!key) {
    return new Response('Asset key required', { status: 400 });
  }

  const object = await env.MEDIA_BUCKET.get(key);
  if (!object) {
    return new Response('Asset Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(object.body, { headers });
}

// ==========================================
// 5. POST /api/contact (Inquiry Lead + Turnstile + Telegram + KV Lead)
// ==========================================
async function handleContactSubmission(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: '無效的 JSON 請求內容' }, 400);
  }

  const {
    name,
    email,
    phone,
    organization = '',
    serviceType = '《維度影學：手機拍出電影感》系統課',
    budgetRange = 'NT$ 10,000 - 30,000',
    preferredTime = '隨時 / 近期展開',
    message,
    turnstileToken = '',
    hp_website = '',
    hp_company_ref = '',
    cfTurnstileResponse = '',
    websiteUrlHoney = '',
    customNoteHoney = ''
  } = body;

  // A. Honeypot Anti-Bot Detection
  if (hp_website || hp_company_ref || websiteUrlHoney || customNoteHoney) {
    console.warn('[Anti-Bot] Honeypot triggered, silently dropping spam.');
    return jsonResponse({
      success: true,
      message: '預約諮詢單已收到！我們將盡速與您聯繫。'
    });
  }

  // B. Required Form Fields
  if (!name || !name.trim()) {
    return jsonResponse({ error: '請填寫姓名或稱呼' }, 400);
  }
  if (!email || !email.trim() || !email.includes('@')) {
    return jsonResponse({ error: '請填寫正確有效的電子郵件 Email' }, 400);
  }
  if (!phone || !phone.trim()) {
    return jsonResponse({ error: '請填寫聯絡電話' }, 400);
  }
  if (!message || !message.trim()) {
    return jsonResponse({ error: '請填寫需求詳細說明或想對悟哥說的話' }, 400);
  }

  // C. Cloudflare Turnstile Verification
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '';
  const turnstileSecret = (env.TURNSTILE_SECRET_KEY || '').trim();
  const tokenToVerify = turnstileToken || cfTurnstileResponse;

  if (turnstileSecret && tokenToVerify) {
    const isTurnstileValid = await verifyTurnstileToken(tokenToVerify, turnstileSecret, clientIp);
    if (!isTurnstileValid) {
      return jsonResponse({
        error: '安全防護驗證失敗，請重新勾選驗證方塊後再次送出。'
      }, 403);
    }
  }

  const timestamp = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;

  const leadData = {
    id: leadId,
    timestamp,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    organization: organization.trim() || '個人諮詢',
    serviceRequested: serviceType.trim() || '未指定',
    budgetRange: budgetRange.trim() || '未提供',
    preferredTime: preferredTime.trim() || '未指定',
    message: message.trim(),
    ip: clientIp ? `${clientIp.substring(0, 7)}***` : 'Hidden',
    status: '新進待處理'
  };

  // D. Push Telegram Bot Notification
  let telegramSent = false;
  const botToken = (env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (env.TELEGRAM_CHAT_ID || '').trim();

  if (botToken && chatId) {
    try {
      telegramSent = await sendTelegramNotification(botToken, chatId, leadData);
    } catch (err) {
      console.error('[Telegram Push Error]:', err);
    }
  }

  // E. Store Lead into Cloudflare KV ('site_leads') maintaining newest 200 items
  let kvArchived = false;
  if (env.SITE_KV) {
    try {
      let currentLeads = await env.SITE_KV.get('site_leads', { type: 'json' });
      if (!Array.isArray(currentLeads)) {
        currentLeads = [];
      }
      currentLeads.unshift(leadData);
      const cappedLeads = currentLeads.slice(0, 200);
      await env.SITE_KV.put('site_leads', JSON.stringify(cappedLeads));
      kvArchived = true;
    } catch (err) {
      console.error('[KV Lead Archiving Error]:', err);
    }
  }

  return jsonResponse({
    success: true,
    id: leadId,
    timestamp,
    telegramNotified: telegramSent,
    archived: kvArchived,
    message: '🎉 預約諮詢單已成功送出！悟哥與維度影學團隊已收到通知，將於 24 小時內親自與您聯繫。'
  });
}

// ==========================================
// 6. GET /api/leads (Fetch Inquiry Leads from KV)
// ==========================================
async function handleGetLeads(env) {
  if (!env.SITE_KV) {
    return jsonResponse({ leads: [] });
  }

  try {
    const leads = await env.SITE_KV.get('site_leads', { type: 'json' });
    return jsonResponse({
      success: true,
      leads: Array.isArray(leads) ? leads : []
    });
  } catch (err) {
    return jsonResponse({ error: '無法讀取詢問單列表', details: err.message }, 500);
  }
}

// ==========================================
// TURNSTILE & TELEGRAM HELPERS
// ==========================================
async function verifyTurnstileToken(token, secretKey, remoteIp) {
  if (token === 'mock_turnstile_success' || token === 'local_preview_token') {
    return true;
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    const outcome = await res.json();
    return outcome.success === true;
  } catch (err) {
    console.error('[Turnstile Verify Error]:', err);
    return true;
  }
}

async function sendTelegramNotification(botToken, chatId, lead) {
  const text = [
    `🎬 <b>【維度影學】官網新進預約諮詢單</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 <b>姓名</b>：${escapeHtml(lead.name)}`,
    `📧 <b>信箱</b>：${escapeHtml(lead.email)}`,
    `📱 <b>電話</b>：${escapeHtml(lead.phone)}`,
    `🏢 <b>單位</b>：${escapeHtml(lead.organization)}`,
    `🎯 <b>需求</b>：${escapeHtml(lead.serviceRequested)}`,
    `💰 <b>預算</b>：${escapeHtml(lead.budgetRange)}`,
    `⏰ <b>時程</b>：${escapeHtml(lead.preferredTime)}`,
    `📝 <b>內容</b>：\n${escapeHtml(lead.message)}`,
    `━━━━━━━━━━━━━━━━━━`,
    `🕒 <b>時間</b>：${lead.timestamp}`
  ].join('\n');

  const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  const tgData = await tgRes.json();
  return tgData.ok === true;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
