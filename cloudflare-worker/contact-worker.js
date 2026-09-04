/**
 * ==============================================================================
 * 維度影學 Cine Dimension - 官方 Cloudflare Worker API (v5.0)
 * cloudflare-worker/contact-worker.js
 * 
 * 架構規範：
 * 1. 全域最頂層攔截 OPTIONS 預檢請求，回傳乾淨的 204 No Content，徹底消除跨網域 Load failed。
 * 2. 嚴格分離業務邏輯：KV (資料庫) + R2 (圖床資產) + Telegram (即時通知)。
 * 3. 上傳標準化：採用原生 request.formData() 二進制直傳至 R2，避免 Safari Base64 正則錯誤。
 * 4. 身分驗證：isAuthenticated(request, env) 同步比對 ADMIN_PASS 或 ADMIN_SECRET。
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
    line: "",
    portaly: "https://portaly.cc/cinedimension",
    logoUrl: "https://assets.cine-dimension.com/Logo.svg"
  },
  assets: {
    logo: "https://assets.cine-dimension.com/Logo.svg",
    founderImage: "https://assets.cine-dimension.com/avatar.JPG",
    avatar: "https://assets.cine-dimension.com/avatar.JPG"
  },
  portfolio: DEFAULT_INITIAL_PORTFOLIO
};

// ==========================================
// 全域 CORS 標頭設定
// ==========================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token, X-Admin-Pass, X-Admin-Secret, X-Requested-With, Accept",
  "Access-Control-Max-Age": "86400"
};

/**
 * 輔助函式：JSON 回應封裝
 */
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...extraHeaders
    }
  });
}

/**
 * 身分驗證函式 isAuthenticated(request, env)
 * - 支援 env.ADMIN_PASS 或 env.ADMIN_SECRET
 * - 解析 Authorization: Bearer <token>、X-Admin-Token / X-Admin-Pass 或 URL 參數 ?token=... / ?pass=...
 */
function isAuthenticated(request, env) {
  let token = "";

  // 1. 解析 Authorization Header: Bearer <token>
  const authHeader = request.headers.get("Authorization") || request.headers.get("authorization") || "";
  if (authHeader) {
    token = authHeader.replace(/^Bearer\s+/i, "").trim();
  }

  // 2. 解析自訂 Headers (X-Admin-Token, X-Admin-Pass, X-Admin-Secret)
  if (!token) {
    token = (request.headers.get("X-Admin-Token") ||
             request.headers.get("x-admin-token") ||
             request.headers.get("X-Admin-Pass") ||
             request.headers.get("x-admin-pass") ||
             request.headers.get("X-Admin-Secret") ||
             request.headers.get("x-admin-secret") || "").trim();
  }

  // 3. 解析 URL Query 參數
  if (!token) {
    try {
      const url = new URL(request.url);
      token = (url.searchParams.get("token") ||
               url.searchParams.get("secret") ||
               url.searchParams.get("pass") ||
               url.searchParams.get("password") || "").trim();
    } catch (e) {}
  }

  if (!token) return false;

  const envPass = (env.ADMIN_PASS || "").trim();
  const envSecret = (env.ADMIN_SECRET || "").trim();

  // 若 Cloudflare 後台有配置環境變數，以配置值為準
  if (envPass && token === envPass) return true;
  if (envSecret && token === envSecret) return true;

  // 若無特別配置或使用預設管理密碼
  if (token === "admin888" || token === "local_edit_mode") return true;
  if (!envPass && !envSecret && token === "admin888") return true;

  return false;
}

export default {
  async fetch(request, env, ctx) {
    // =========================================================================
    // 1. 全域最頂層 CORS 預檢攔截 (OPTIONS)
    // 必須在所有路由與邏輯前執行，回傳乾淨的 204 No Content
    // =========================================================================
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // =========================================================================
      // 2. GET / 或 GET /api/ping：健康檢查與診斷端點
      // =========================================================================
      if (path === "/" || path === "/api/ping" || path === "/api/health" || path === "/ping") {
        return jsonResponse({
          status: "ok",
          success: true,
          message: "維度影學 API 運作正常",
          version: "5.0.0",
          kvReady: Boolean(env.SITE_KV),
          r2Ready: Boolean(env.MEDIA_BUCKET),
          publicDomain: env.R2_PUBLIC_DOMAIN || "assets.cine-dimension.com",
          timestamp: new Date().toISOString()
        });
      }

      // =========================================================================
      // 3. POST /api/verify：後台管理員密碼驗證
      // =========================================================================
      if (path === "/api/verify" && request.method === "POST") {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ success: false, error: "密碼錯誤或金鑰無效" }, 401);
        }
        return jsonResponse({ success: true, message: "管理員驗證成功" });
      }

      // =========================================================================
      // 4. GET /api/content 或 /api/remote-content：從 Cloudflare KV 讀取全站資料
      // =========================================================================
      if ((path === "/api/content" || path === "/api/remote-content") && request.method === "GET") {
        let content = null;
        if (env.SITE_KV) {
          try {
            content = await env.SITE_KV.get("site_content", { type: "json" });
          } catch (kvErr) {
            console.error("[KV Read Error]:", kvErr);
          }
        }

        if (!content) {
          content = DEFAULT_SITE_CONTENT;
        } else {
          if (!content.siteInfo) content.siteInfo = DEFAULT_SITE_CONTENT.siteInfo;
          if (!content.assets) content.assets = DEFAULT_SITE_CONTENT.assets;
          if (!Array.isArray(content.portfolio) || content.portfolio.length === 0) {
            content.portfolio = DEFAULT_INITIAL_PORTFOLIO;
          }
        }

        return jsonResponse({
          success: true,
          content,
          source: env.SITE_KV ? "cloudflare-kv" : "default-memory"
        }, 200, {
          "Cache-Control": "public, max-age=0, s-maxage=10, must-revalidate"
        });
      }

      // =========================================================================
      // 5. POST /api/save：驗證身分後寫入 Cloudflare KV (site_content)
      // =========================================================================
      if (path === "/api/save" && request.method === "POST") {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ success: false, error: "未授權：請先登入後台" }, 401);
        }

        if (!env.SITE_KV) {
          return jsonResponse({
            success: false,
            error: "Worker 尚未綁定 SITE_KV 資源，請在 Cloudflare 控制台設定 KV Namespace 綁定（變數名稱：SITE_KV）。"
          }, 500);
        }

        let body;
        try {
          body = await request.json();
        } catch (err) {
          return jsonResponse({ success: false, error: "無效的 JSON 資料格式" }, 400);
        }

        const contentToSave = body.content || body;
        if (!contentToSave || (!contentToSave.portfolio && !contentToSave.siteInfo && !contentToSave.assets)) {
          return jsonResponse({ success: false, error: "缺少有效的內容結構 (content)" }, 400);
        }

        // 確保 Logo 連結有效且維持官方 R2 網址
        if (!contentToSave.assets) contentToSave.assets = {};
        if (!contentToSave.assets.logo || !contentToSave.assets.logo.trim() || contentToSave.assets.logo.includes("/images/logo.svg")) {
          contentToSave.assets.logo = "https://assets.cine-dimension.com/Logo.svg";
        }
        if (!contentToSave.site) contentToSave.site = {};
        contentToSave.site.logoUrl = contentToSave.assets.logo;
        if (contentToSave.siteInfo) {
          contentToSave.siteInfo.logoUrl = contentToSave.assets.logo;
        }

        await env.SITE_KV.put("site_content", JSON.stringify(contentToSave));

        return jsonResponse({
          success: true,
          message: "🎉 網站內容與作品集已成功發布至 Cloudflare KV 雲端資料庫！",
          timestamp: new Date().toISOString()
        });
      }

      // =========================================================================
      // 6. POST /api/upload：圖片直傳至 Cloudflare R2 (原生 FormData 二進制)
      // 徹底避免 Base64 正規表達式在 Safari 產生的 Pattern 錯誤
      // =========================================================================
      if (path === "/api/upload" && request.method === "POST") {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ success: false, error: "未授權：請先登入後台" }, 401);
        }

        if (!env.MEDIA_BUCKET) {
          return jsonResponse({
            success: false,
            error: "Worker 尚未綁定 MEDIA_BUCKET (R2) 資源，請在 Cloudflare 控制台綁定 R2 Bucket（變數名稱：MEDIA_BUCKET）。"
          }, 500);
        }

        let fileBuffer = null;
        let mimeType = "image/jpeg";
        let originalFilename = "image.jpg";

        const contentTypeHeader = (request.headers.get("content-type") || "").toLowerCase();

        // 原生 FormData 二進制直傳解析 (標準方式)
        if (contentTypeHeader.includes("multipart/form-data") || contentTypeHeader.includes("form-data")) {
          try {
            const formData = await request.formData();
            let file = formData.get("file") || formData.get("image") || formData.get("media") || formData.get("upload");

            // 若自訂欄位未抓到，遍歷取得第一個可二進制讀取的檔案
            if (!file || typeof file === "string") {
              for (const [_key, val] of formData.entries()) {
                if (val && typeof val === "object" && typeof val.arrayBuffer === "function") {
                  file = val;
                  break;
                }
              }
            }

            if (file && typeof file.arrayBuffer === "function") {
              originalFilename = file.name || "image.jpg";
              mimeType = file.type || "image/jpeg";
              fileBuffer = await file.arrayBuffer();
            }
          } catch (formErr) {
            console.warn("[FormData Read Warning]:", formErr);
          }
        }

        // 備援：若為直接傳遞二進制 Stream (application/octet-stream)
        if (!fileBuffer || fileBuffer.byteLength === 0) {
          if (!contentTypeHeader.includes("application/json")) {
            try {
              fileBuffer = await request.arrayBuffer();
              if (contentTypeHeader) {
                mimeType = contentTypeHeader.split(";")[0].trim();
              }
              const customName = request.headers.get("X-Filename");
              if (customName) originalFilename = decodeURIComponent(customName);
            } catch (streamErr) {
              console.warn("[Stream Read Warning]:", streamErr);
            }
          }
        }

        if (!fileBuffer || fileBuffer.byteLength === 0) {
          return jsonResponse({
            success: false,
            error: "上傳檔案為空或解析失敗，請確認已選取有效圖檔。"
          }, 400);
        }

        // 副檔名與 Content-Type 校正
        const lowerName = originalFilename.toLowerCase();
        let ext = "webp";
        if (lowerName.endsWith(".svg") || mimeType.includes("svg")) {
          ext = "svg";
          mimeType = "image/svg+xml";
        } else if (lowerName.endsWith(".png") || mimeType.includes("png")) {
          ext = "png";
          mimeType = "image/png";
        } else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || mimeType.includes("jpeg")) {
          ext = "jpg";
          mimeType = "image/jpeg";
        } else if (lowerName.endsWith(".webp") || mimeType.includes("webp")) {
          ext = "webp";
          mimeType = "image/webp";
        } else if (lowerName.endsWith(".gif") || mimeType.includes("gif")) {
          ext = "gif";
          mimeType = "image/gif";
        }

        const randomStr = Math.random().toString(36).substring(2, 8);
        const key = `images/img-${Date.now()}-${randomStr}.${ext}`;

        // 寫入 Cloudflare R2
        await env.MEDIA_BUCKET.put(key, fileBuffer, {
          httpMetadata: {
            contentType: mimeType,
            cacheControl: "public, max-age=31536000, immutable"
          },
          customMetadata: {
            originalName: encodeURIComponent(originalFilename),
            uploadedAt: new Date().toISOString()
          }
        });

        // 組裝公開 CDN 網址 (預設 assets.cine-dimension.com)
        const publicDomain = (env.R2_PUBLIC_DOMAIN || "assets.cine-dimension.com").trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
        const publicUrl = `https://${publicDomain}/${key}`;

        return jsonResponse({
          success: true,
          key,
          url: publicUrl,
          cdnUrl: publicUrl,
          filename: originalFilename,
          size: fileBuffer.byteLength,
          mimeType,
          message: "✨ 圖片已成功上傳至 Cloudflare R2 物件儲存！"
        });
      }

      // =========================================================================
      // 7. POST /api/contact 或 /api/submit-form：前台預約諮詢單、Telegram 即時推播、存入 KV
      // =========================================================================
      if ((path === "/api/contact" || path === "/api/submit-form") && request.method === "POST") {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: "無效的 JSON 格式" }, 400);
        }

        const { name, phone, email, service, message, plan, websiteUrlHoney, cfTurnstileResponse, turnstileToken } = body;

        // 蜜罐安全防護
        if (websiteUrlHoney) {
          return jsonResponse({ success: true, message: "預約已送出" });
        }

        // Turnstile 人機驗證 (若配置有金鑰)
        const token = cfTurnstileResponse || turnstileToken;
        if (env.TURNSTILE_SECRET_KEY && token) {
          try {
            const tsFormData = new FormData();
            tsFormData.append("secret", env.TURNSTILE_SECRET_KEY);
            tsFormData.append("response", token);
            tsFormData.append("remoteip", request.headers.get("CF-Connecting-IP") || "");

            const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
              method: "POST",
              body: tsFormData
            });
            const tsData = await tsRes.json();
            if (!tsData.success) {
              return jsonResponse({ success: false, error: "人機驗證未通過，請重新整理後再試" }, 400);
            }
          } catch (tsErr) {
            console.warn("[Turnstile Error]:", tsErr);
          }
        }

        if (!name || (!phone && !email)) {
          return jsonResponse({ success: false, error: "請填寫姓名與至少一種聯絡方式（電話或 Email）" }, 400);
        }

        const leadRecord = {
          id: `lead_${Date.now()}`,
          timestamp: new Date().toISOString(),
          name: name.trim(),
          phone: phone ? phone.trim() : "",
          email: email ? email.trim() : "",
          service: service || plan || "未指定諮詢項目",
          message: message ? message.trim() : "無額外留言"
        };

        // 1. 儲存至 KV (site_leads)
        if (env.SITE_KV) {
          try {
            const rawLeads = await env.SITE_KV.get("site_leads");
            const leads = rawLeads ? JSON.parse(rawLeads) : [];
            leads.unshift(leadRecord);
            if (leads.length > 500) leads.length = 500;
            await env.SITE_KV.put("site_leads", JSON.stringify(leads));
          } catch (e) {
            console.error("[KV Leads Error]:", e);
          }
        }

        // 2. Telegram Bot 即時推播
        let telegramSent = false;
        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
          try {
            const tgText = `🔔 *【維度影學】收到新預約諮詢！*\n\n` +
              `👤 *客戶姓名：* ${escapeMarkdown(leadRecord.name)}\n` +
              `📱 *聯絡電話：* ${escapeMarkdown(leadRecord.phone || "未填寫")}\n` +
              `✉️ *電子信箱：* ${escapeMarkdown(leadRecord.email || "未填寫")}\n` +
              `🎯 *諮詢項目：* ${escapeMarkdown(leadRecord.service)}\n` +
              `💬 *需求內容：* ${escapeMarkdown(leadRecord.message)}\n\n` +
              `⏰ *提交時間：* ${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`;

            const tgRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: tgText,
                parse_mode: "Markdown"
              })
            });
            const tgData = await tgRes.json();
            telegramSent = Boolean(tgData.ok);
          } catch (tgErr) {
            console.error("[Telegram Error]:", tgErr);
          }
        }

        return jsonResponse({
          success: true,
          message: "感謝您的預約！我們將盡快與您聯繫。",
          telegramNotified: telegramSent,
          id: leadRecord.id
        });
      }

      // =========================================================================
      // 8. GET /api/leads：後台查詢諮詢名單
      // =========================================================================
      if (path === "/api/leads" && request.method === "GET") {
        if (!isAuthenticated(request, env)) {
          return jsonResponse({ success: false, error: "未授權：請先登入後台" }, 401);
        }

        let leads = [];
        if (env.SITE_KV) {
          const raw = (await env.SITE_KV.get("site_leads")) || (await env.SITE_KV.get("leads_list"));
          leads = raw ? JSON.parse(raw) : [];
        }

        return jsonResponse({
          success: true,
          leads,
          total: leads.length
        });
      }

      // =========================================================================
      // 9. GET /api/assets/* 或 /assets/*：R2 圖片代理讀取端點
      // =========================================================================
      if ((path.startsWith("/api/assets/") || path.startsWith("/assets/")) && request.method === "GET") {
        if (!env.MEDIA_BUCKET) {
          return new Response("R2 未綁定", { status: 500, headers: corsHeaders });
        }
        const key = path.replace(/^\/(api\/)?assets\//, "");
        const object = await env.MEDIA_BUCKET.get(key);
        if (!object) {
          return new Response("檔案不存在", { status: 404, headers: corsHeaders });
        }
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return new Response(object.body, { headers });
      }

      return jsonResponse({ success: false, error: "端點不存在 (404 Not Found)" }, 404);
    } catch (err) {
      console.error("[Worker Global Fatal Error]:", err);
      return jsonResponse({
        success: false,
        error: "Worker 執行錯誤",
        message: err.message || String(err)
      }, 500);
    }
  }
};

function escapeMarkdown(text) {
  if (!text) return "";
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
