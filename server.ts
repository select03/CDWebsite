import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
    portaly: "https://portaly.cc/cinedimension",
    logoUrl: "https://assets.cine-dimension.com/Logo.svg"
  },
  site: {
    title: "維度影學 Cine Dimension",
    logoUrl: "https://assets.cine-dimension.com/Logo.svg"
  },
  assets: {
    logo: "https://assets.cine-dimension.com/Logo.svg",
    founderImage: "https://assets.cine-dimension.com/avatar.JPG"
  },
  portfolio: DEFAULT_INITIAL_PORTFOLIO
};

// In-memory runtime database cache for local server
let inMemoryContentCache: any = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
let inMemoryLeads: any[] = [];

// ==========================================
// API ROUTES
// ==========================================
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "CineDimension Express Server (Dev Mode)",
    hasTelegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    timestamp: new Date().toISOString()
  });
});

// GET /api/content (KV Proxy & Local Cache)
app.get(["/api/content", "/api/remote-content"], (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.json({
    success: true,
    content: inMemoryContentCache,
    source: "local-express-cache"
  });
});

// POST /api/save (Save Content to Local Cache / Mock KV)
app.post("/api/save", (req, res) => {
  const body = req.body;
  const content = body.content || body;
  if (content && (content.portfolio || content.siteInfo || content.assets)) {
    inMemoryContentCache = content;
    return res.json({
      success: true,
      message: "網站內容已成功儲存！",
      timestamp: new Date().toISOString()
    });
  }
  return res.status(400).json({ error: "無效的內容結構" });
});

// POST /api/upload (Handle Image Upload in Dev Mode)
app.post("/api/upload", (req, res) => {
  const { filename, base64 } = req.body;
  if (base64) {
    // In local dev, return the base64 or a generated URL
    return res.json({
      success: true,
      key: filename || `img-${Date.now()}.jpg`,
      url: base64,
      rawUrl: base64,
      message: "圖片已上傳至暫存"
    });
  }
  return res.status(400).json({ error: "缺少 base64 圖片內容" });
});

// GET /api/leads (Fetch Leads)
app.get("/api/leads", (_req, res) => {
  res.json({
    success: true,
    leads: inMemoryLeads
  });
});

// POST /api/contact or /api/submit-form
app.post(["/api/submit-form", "/api/contact"], async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization = "",
      serviceType,
      serviceRequested,
      budgetRange,
      preferredTime,
      message,
      cfTurnstileResponse,
      turnstileToken,
      websiteUrlHoney,
      customNoteHoney,
      hp_website,
      hp_company_ref
    } = req.body;

    // Anti-Spam Honeypot Verification
    if (websiteUrlHoney || customNoteHoney || hp_website || hp_company_ref) {
      console.warn("[Spam Blocked] Honeypot triggered:", { name, email, ip: req.ip });
      return res.status(200).json({
        success: true,
        message: "預約需求已送出，我們將盡快與您聯繫！"
      });
    }

    // Required fields check
    if (!name || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: "請至少提供姓名以及 Email 或電話"
      });
    }

    // Cloudflare Turnstile Verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const token = turnstileToken || cfTurnstileResponse;
    if (turnstileSecret && token && token !== "local_preview_token") {
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: token,
            remoteip: req.ip
          })
        });
        const verifyData: any = await verifyRes.json();
        if (!verifyData.success) {
          console.warn("[Turnstile Failed]", verifyData);
          return res.status(400).json({
            success: false,
            error: "人機安全驗證失敗，請重試"
          });
        }
      } catch (err) {
        console.error("Turnstile error:", err);
      }
    }

    const nowStr = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    const leadItem = {
      id: `LEAD-${Date.now().toString(36).toUpperCase()}`,
      timestamp: nowStr,
      name: (name || "").trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      organization: (organization || "個人諮詢").trim(),
      serviceRequested: (serviceType || serviceRequested || "未指定").trim(),
      budgetRange: (budgetRange || "未提供").trim(),
      preferredTime: (preferredTime || "未提供").trim(),
      message: (message || "無").trim(),
      status: "新進待處理"
    };

    inMemoryLeads.unshift(leadItem);
    if (inMemoryLeads.length > 200) {
      inMemoryLeads = inMemoryLeads.slice(0, 200);
    }

    // Forward notification to Telegram Bot if configured
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgBotToken && tgChatId) {
      const text = [
        `🎬 <b>【維度影學】新官網諮詢通知</b>`,
        `━━━━━━━━━━━━━━━━━━`,
        `👤 <b>姓名</b>：${leadItem.name}`,
        `📧 <b>Email</b>：${leadItem.email || "未提供"}`,
        `📱 <b>電話</b>：${leadItem.phone || "未提供"}`,
        `🏢 <b>單位/職稱</b>：${leadItem.organization}`,
        `🎯 <b>諮詢服務</b>：${leadItem.serviceRequested}`,
        `💰 <b>預算範圍</b>：${leadItem.budgetRange}`,
        `⏰ <b>偏好時間</b>：${leadItem.preferredTime}`,
        `📝 <b>專案說明</b>：\n${leadItem.message}`,
        `━━━━━━━━━━━━━━━━━━`,
        `🕒 <b>送出時間</b>：${nowStr}`
      ].join("\n");

      fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text,
          parse_mode: "HTML"
        })
      }).catch(err => console.error("Telegram notification failed:", err));
    }

    return res.json({
      success: true,
      id: leadItem.id,
      timestamp: nowStr,
      message: "預約需求已成功送出！維度影學團隊將於 24 小時內與您聯繫。"
    });
  } catch (error: any) {
    console.error("Contact submit error:", error);
    return res.status(500).json({
      success: false,
      error: "伺服器處理錯誤，請直接來信 hi@cine-dimension.com"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
