import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// In-memory content cache (no local content.json file on disk)
let inMemoryContentCache: any = null;

// Helper to fetch latest content from GitHub remote
async function getRemoteGitHubContent() {
  const repos = [
    "https://raw.githubusercontent.com/select03/cindimenswebsite1/main/content.json",
    "https://raw.githubusercontent.com/select03/cindimenswebsite/main/content.json"
  ];

  for (const url of repos) {
    try {
      const res = await fetch(`${url}?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const remoteData = await res.json();
        if (remoteData && (remoteData.portfolio || remoteData.assets || remoteData.siteInfo)) {
          if (remoteData.assets) {
            const rawLogo = (remoteData.assets.logo || '').trim();
            if (!rawLogo || rawLogo.includes('assets/images/image.jpeg') || rawLogo.endsWith('/image.jpeg')) {
              remoteData.assets.logo = '/images/logo.svg';
            }
          }
          inMemoryContentCache = remoteData;
          return { success: true, url, data: remoteData };
        }
      }
    } catch (err) {
      console.warn(`[GitHub Remote Warning] Failed to fetch from ${url}:`, err);
    }
  }
  return { success: false, error: "Could not fetch from remote GitHub repositories" };
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Dynamic content endpoint proxying GitHub directly
app.get("/api/remote-content", async (_req, res) => {
  const result = await getRemoteGitHubContent();
  if (result.success) {
    return res.json(result.data);
  }
  if (inMemoryContentCache) {
    return res.json(inMemoryContentCache);
  }
  return res.status(404).json({ error: "Remote content not found" });
});

// Endpoint for contact form submissions with Telegram & Anti-Bot
app.post(["/api/submit-form", "/api/contact"], async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization,
      serviceRequested,
      budgetRange,
      preferredTime,
      message,
      cfTurnstileResponse,
      websiteUrlHoney,
      customNoteHoney
    } = req.body;

    // Anti-Spam Honeypot Verification
    if (websiteUrlHoney || customNoteHoney) {
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

    // Cloudflare Turnstile Verification (if secret key present)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && cfTurnstileResponse) {
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: cfTurnstileResponse,
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

    // Forward notification to Telegram Bot if configured
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgBotToken && tgChatId) {
      const nowStr = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
      const text = [
        `🎬 <b>【維度影學】新官網諮詢通知</b>`,
        `━━━━━━━━━━━━━━━━━━`,
        `👤 <b>姓名</b>：${name}`,
        `📧 <b>Email</b>：${email || "未提供"}`,
        `📱 <b>電話</b>：${phone || "未提供"}`,
        `🏢 <b>單位/職稱</b>：${organization || "個人/未提供"}`,
        `🎯 <b>諮詢服務</b>：${serviceRequested || "未指定"}`,
        `💰 <b>預算範圍</b>：${budgetRange || "未提供"}`,
        `⏰ <b>偏好時間</b>：${preferredTime || "未提供"}`,
        `📝 <b>專案說明</b>：\n${message || "無"}`,
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
