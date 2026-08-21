/**
 * Cloudflare Worker: Headless CMS Backend with Cloudflare KV (v3.0)
 * 
 * 核心升級：
 * 1. 改用 Cloudflare KV (`env.SITE_KV`) 儲存與讀取 site_content
 * 2. 徹底移除對 GitHub 儲存庫進行 Commit / 上傳檔案的依賴，徹底避免 Git 歷史衝突
 * 3. 圖片素材以 Base64 或自訂 CDN 儲存於 KV 或獨立空間
 * 4. 提供公開/免權限或帶權限的 GET /api/content 快速讀取最新資料
 * 5. POST /api/save 直接將 content JSON 寫入 KV (key: 'site_content')
 * 
 * Environment Bindings (Set in Cloudflare Dashboard):
 * - KV Namespace Binding: SITE_KV (綁定到你的 KV 空間)
 * - ADMIN_USER: 管理員帳號 (預設 "admin")
 * - ADMIN_PASS: 管理員密碼 (預設 "admin888")
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma',
  'Access-Control-Max-Age': '86400',
};

// 6 筆預設經典作品集資料（當 KV 尚為空時自動提供完整結構）
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
    image: "https://img.youtube.com/vi/_JjmH05QYlU/hqdefault.jpg",
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
    image: "https://img.youtube.com/vi/eFJcTN9lt9s/hqdefault.jpg",
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
    image: "https://img.youtube.com/vi/G09UZtpbyN0/hqdefault.jpg",
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
    image: "https://img.youtube.com/vi/5p7nMVHx-AE/hqdefault.jpg",
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
    instagram: ""
  },
  assets: {
    logo: "/images/logo.svg",
    founderImage: "/images/avatar.svg",
    bannerImage: ""
  },
  portfolio: DEFAULT_INITIAL_PORTFOLIO
};

export default {
  async fetch(request, env) {
    // 1. Handle CORS Preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 2. Health check route
      if (path === '/' || path === '/api/health') {
        return jsonResponse({
          status: 'ok',
          service: 'CineDimension CMS KV Worker',
          version: '3.0.0 (Cloudflare KV Powered)',
          hasKvBinding: Boolean(env.SITE_KV),
          timestamp: new Date().toISOString()
        });
      }

      // 3. Public GET /api/content - 直接從 KV 讀取最新內容（免驗證，支援前端即時讀取）
      if (path === '/api/content' && request.method === 'GET') {
        return await handleGetContentFromKV(env);
      }

      // 4. Public Login Route: POST /api/login
      if (path === '/api/login' && request.method === 'POST') {
        return await handleLogin(request, env);
      }

      // 5. Authenticate all protected /api/* write routes
      if (path.startsWith('/api/')) {
        const isAuth = await verifyAuth(request, env);
        if (!isAuth) {
          return jsonResponse({ error: '未授權：請先登入後台或登入 Token 已過期' }, 401);
        }

        // Route: POST /api/save (Save content directly to Cloudflare KV: 'site_content')
        if (path === '/api/save' && request.method === 'POST') {
          return await handleSaveContentToKV(request, env);
        }

        // Route: POST /api/upload (Upload image base64 directly to KV or return base64 URL)
        if (path === '/api/upload' && request.method === 'POST') {
          return await handleUploadToKV(request, env);
        }

        // Route: POST /api/delete-asset
        if (path === '/api/delete-asset' && request.method === 'POST') {
          return await handleDeleteAssetFromKV(request, env);
        }
      }

      return jsonResponse({ error: 'API 路徑不存在' }, 404);
    } catch (err) {
      console.error('Worker Internal Error:', err);
      return jsonResponse({
        error: '伺服器內部錯誤',
        message: err.message,
        stack: err.stack
      }, 500);
    }
  }
};

// ==========================================
// AUTHENTICATION LOGIC (HMAC-SHA256)
// ==========================================

async function handleLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body;

  const validUser = (env.ADMIN_USER || 'admin').trim();
  const validPass = (env.ADMIN_PASS || 'admin888').trim();

  if (!username || !password || username !== validUser || password !== validPass) {
    return jsonResponse({ error: '帳號或密碼錯誤，請重新輸入' }, 401);
  }

  const timestamp = Date.now();
  const tokenPayload = `${username}:${timestamp}`;
  const token = await generateToken(tokenPayload, validPass);

  return jsonResponse({
    success: true,
    message: '登入成功',
    token: `${timestamp}.${token}`,
    user: username
  });
}

async function verifyAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const tokenStr = authHeader.replace('Bearer ', '').trim();
  const [timestampStr, tokenHash] = tokenStr.split('.');
  if (!timestampStr || !tokenHash) return false;

  const timestamp = parseInt(timestampStr, 10);
  const now = Date.now();
  
  // 7 days token expiry
  if (isNaN(timestamp) || now - timestamp > 7 * 24 * 60 * 60 * 1000) {
    return false;
  }

  const validUser = (env.ADMIN_USER || 'admin').trim();
  const validPass = (env.ADMIN_PASS || 'admin888').trim();
  const expectedHash = await generateToken(`${validUser}:${timestamp}`, validPass);

  return tokenHash === expectedHash;
}

async function generateToken(message, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ==========================================
// CLOUDFLARE KV HANDLERS (NO GITHUB COMMITS)
// ==========================================

/**
 * GET /api/content: Retrieve 'site_content' from Cloudflare KV
 */
async function handleGetContentFromKV(env) {
  if (!env.SITE_KV) {
    // 若尚未綁定 KV，回傳預設結構並提示
    return jsonResponse({
      exists: false,
      source: 'default_fallback',
      warning: '尚未在 Cloudflare Worker Dashboard 綁定 SITE_KV Namespace，目前提供預設資料',
      content: DEFAULT_SITE_CONTENT
    });
  }

  try {
    const rawKVData = await env.SITE_KV.get('site_content', { type: 'json' });

    if (!rawKVData) {
      return jsonResponse({
        exists: false,
        source: 'kv_empty_default',
        content: DEFAULT_SITE_CONTENT
      });
    }

    // 確保結構完整
    const rawAssets = rawKVData.assets || DEFAULT_SITE_CONTENT.assets;
    let logoUrl = rawAssets.logo || '/images/logo.svg';
    if (logoUrl.includes('assets/images/image.jpeg') || logoUrl.endsWith('/image.jpeg')) {
      logoUrl = '/images/logo.svg';
    }

    const content = {
      siteInfo: rawKVData.siteInfo || DEFAULT_SITE_CONTENT.siteInfo,
      assets: {
        ...rawAssets,
        logo: logoUrl
      },
      portfolio: Array.isArray(rawKVData.portfolio) && rawKVData.portfolio.length > 0
        ? rawKVData.portfolio
        : DEFAULT_INITIAL_PORTFOLIO
    };

    return jsonResponse({
      exists: true,
      source: 'cloudflare_kv',
      updatedAt: rawKVData.updatedAt || null,
      content
    });
  } catch (err) {
    console.error('KV Read Error:', err);
    return jsonResponse({
      exists: false,
      error: '讀取 KV 資料失敗',
      message: err.message,
      content: DEFAULT_SITE_CONTENT
    }, 500);
  }
}

/**
 * POST /api/save: Save content JSON directly into Cloudflare KV ('site_content')
 */
async function handleSaveContentToKV(request, env) {
  if (!env.SITE_KV) {
    return jsonResponse({
      error: 'Worker 尚未綁定 SITE_KV Namespace',
      help: '請至 Cloudflare Dashboard -> Workers & Pages -> 點選你的 Worker -> Settings -> Variables -> KV Namespace Bindings 綁定 SITE_KV'
    }, 500);
  }

  const body = await request.json().catch(() => ({}));
  const { content, message } = body;

  if (!content) {
    return jsonResponse({ error: '缺少 content 資料' }, 400);
  }

  const nowISO = new Date().toISOString();
  const dataToStore = {
    ...content,
    updatedAt: nowISO,
    lastCommitMessage: message || `CMS 更新 (${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })})`
  };

  try {
    // 寫入 Cloudflare KV，永久保存
    await env.SITE_KV.put('site_content', JSON.stringify(dataToStore));

    return jsonResponse({
      success: true,
      message: '🎉 發佈成功！資料已安全寫入 Cloudflare KV 雲端資料庫，全球邊緣即刻生效！',
      updatedAt: nowISO,
      key: 'site_content'
    });
  } catch (err) {
    console.error('KV Write Error:', err);
    return jsonResponse({
      error: '寫入 Cloudflare KV 失敗',
      details: err.message
    }, 500);
  }
}

/**
 * POST /api/upload: Upload image base64 directly to KV or return compressed Base64
 */
async function handleUploadToKV(request, env) {
  const body = await request.json().catch(() => ({}));
  const { filename, base64 } = body;

  if (!filename || !base64) {
    return jsonResponse({ error: '請提供 filename 與 base64 檔案內容' }, 400);
  }

  const extMatch = filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').substring(0, 30);
  const key = `img_${Date.now()}_${sanitizedName || 'image'}.${ext}`;

  // If SITE_KV is bound and image base64 is provided, store in KV
  if (env.SITE_KV) {
    try {
      await env.SITE_KV.put(`asset:${key}`, base64, {
        metadata: { filename, contentType: `image/${ext === 'svg' ? 'svg+xml' : ext}`, uploadedAt: Date.now() }
      });
    } catch (err) {
      console.warn('KV Asset save warning:', err);
    }
  }

  // Base64 can be directly embedded or referenced
  return jsonResponse({
    success: true,
    path: key,
    rawUrl: base64,
    message: '圖片上傳並就緒！'
  });
}

/**
 * POST /api/delete-asset
 */
async function handleDeleteAssetFromKV(request, env) {
  const body = await request.json().catch(() => ({}));
  const { filePath } = body;

  if (!filePath) return jsonResponse({ error: '請提供 filePath' }, 400);

  if (env.SITE_KV && filePath.startsWith('img_')) {
    await env.SITE_KV.delete(`asset:${filePath}`);
  }

  return jsonResponse({ success: true, message: `素材 ${filePath} 已標記移除` });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...CORS_HEADERS
    }
  });
}
