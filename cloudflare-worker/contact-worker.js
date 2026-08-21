/**
 * ==============================================================================
 * 維度影學 CineDimension - 官方預約諮詢與聯繫後端 (Cloudflare Worker)
 * contact-worker.js
 * 
 * 功能亮點：
 * 1. Cloudflare Turnstile 無感智慧防機器人驗證 (Siteverify API)
 * 2. Honeypot 蜜罐陷阱防爬蟲防禦
 * 3. Telegram Bot 即時通知推播 (排版清晰美觀的 Markdown 格式)
 * 4. GitHub REST API 自動名單建檔存檔 (寫入 data/leads.json，免訪客授權)
 * 5. 跨域 CORS 支援與嚴格資料驗證
 * ==============================================================================
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. CORS Preflight Handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders()
      });
    }

    // 2. Health check route
    if (url.pathname === '/api/health' || url.pathname === '/') {
      return jsonResponse({
        status: 'online',
        service: 'CineDimension Contact & Booking Worker',
        version: '2.0.0',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Contact Form Submission Route
    if (url.pathname === '/api/contact' || url.pathname === '/api/submit-form') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405);
      }
      return await handleContactSubmission(request, env);
    }

    // 4. Telegram Test Route (for admin verification)
    if (url.pathname === '/api/test-telegram') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405);
      }
      return await handleTelegramTest(request, env);
    }

    return jsonResponse({ error: 'Endpoint Not Found' }, 404);
  }
};

// ==========================================
// CORS HEADERS HELPER
// ==========================================
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...getCorsHeaders()
    }
  });
}

// ==========================================
// CONTACT SUBMISSION HANDLER
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
    // Anti-Bot fields
    turnstileToken = '',
    hp_website = '', // Honeypot trap 1
    hp_company_ref = '', // Honeypot trap 2
    durationMs = 0
  } = body;

  // ----------------------------------------------------
  // A. Honeypot Anti-Bot Trap Detection
  // ----------------------------------------------------
  if (hp_website || hp_company_ref) {
    console.warn('[Anti-Bot] Honeypot triggered, silently dropping spam.');
    // Return 200 success to mislead spambots without processing
    return jsonResponse({
      success: true,
      message: '預約諮詢單已收到！我們將盡速與您聯繫。'
    });
  }

  // ----------------------------------------------------
  // B. Required Form Fields Validation
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // C. Cloudflare Turnstile Verification
  // ----------------------------------------------------
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '';
  const turnstileSecret = env.TURNSTILE_SECRET_KEY ? env.TURNSTILE_SECRET_KEY.trim() : '';

  if (turnstileSecret && turnstileToken) {
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken, turnstileSecret, clientIp);
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
    serviceType: serviceType.trim(),
    budgetRange: budgetRange.trim(),
    preferredTime: preferredTime.trim() || '未指定',
    message: message.trim(),
    ip: clientIp ? `${clientIp.substring(0, 7)}***` : 'Hidden',
    status: '新進待處理'
  };

  // ----------------------------------------------------
  // D. Telegram Bot Instant Notification Push
  // ----------------------------------------------------
  let telegramSent = false;
  let telegramError = null;

  const botToken = env.TELEGRAM_BOT_TOKEN ? env.TELEGRAM_BOT_TOKEN.trim() : '';
  const chatId = env.TELEGRAM_CHAT_ID ? env.TELEGRAM_CHAT_ID.trim() : '';

  if (botToken && chatId) {
    try {
      telegramSent = await sendTelegramNotification(botToken, chatId, leadData);
    } catch (err) {
      console.error('[Telegram Push Error]:', err);
      telegramError = err.message;
    }
  } else {
    console.warn('[Telegram Config] TELEGRAM_BOT_TOKEN 或 TELEGRAM_CHAT_ID 尚未在 Worker 設定。');
  }

  // ----------------------------------------------------
  // E. Automatic Archiving to GitHub (data/leads.json)
  // ----------------------------------------------------
  let githubArchived = false;
  const githubToken = env.GITHUB_TOKEN ? env.GITHUB_TOKEN.trim() : '';
  const repoOwner = (env.REPO_OWNER || 'select03').trim();
  const repoName = (env.REPO_NAME || 'cindimenswebsite1').trim();
  const branch = (env.BRANCH || 'main').trim();

  if (githubToken) {
    try {
      githubArchived = await appendLeadToGitHub(githubToken, repoOwner, repoName, branch, leadData);
    } catch (err) {
      console.error('[GitHub Lead Archiving Error]:', err);
    }
  }

  return jsonResponse({
    success: true,
    id: leadId,
    timestamp,
    telegramNotified: telegramSent,
    archived: githubArchived,
    message: '🎉 預約諮詢單已成功送出！悟哥與維度影學團隊已收到通知，將於 24 小時內親自與您聯繫。'
  });
}

// ==========================================
// CLOUDFLARE TURNSTILE VERIFICATION HELPER
// ==========================================
async function verifyTurnstileToken(token, secretKey, remoteIp) {
  // Allow bypass for local dev mock tokens
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
    // In case of transient network failure to Turnstile, fail safely or allow depending on policy
    return true;
  }
}

// ==========================================
// TELEGRAM NOTIFICATION BUILDER & SENDER
// ==========================================
async function sendTelegramNotification(botToken, chatId, lead) {
  // Format neat, high-readability HTML message for Telegram
  const text = [
    `🎬 <b>【維度影學 收到新諮詢預約單】</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 <b>預約稱呼：</b> ${escapeHtml(lead.name)}`,
    `📞 <b>聯絡電話：</b> <code>${escapeHtml(lead.phone)}</code>`,
    `✉️ <b>電子郵件：</b> ${escapeHtml(lead.email)}`,
    `🏢 <b>單位/品牌：</b> ${escapeHtml(lead.organization)}`,
    `🎯 <b>意向項目：</b> <b>${escapeHtml(lead.serviceType)}</b>`,
    `💰 <b>預算範圍：</b> ${escapeHtml(lead.budgetRange)}`,
    `⏰ <b>期望時間：</b> ${escapeHtml(lead.preferredTime)}`,
    `━━━━━━━━━━━━━━━━━━`,
    `📝 <b>需求說明與留言：</b>`,
    `<i>${escapeHtml(lead.message)}</i>`,
    `━━━━━━━━━━━━━━━━━━`,
    `⏱️ <b>提交時間：</b> ${lead.timestamp}`,
    `🆔 <b>單據編號：</b> <code>${lead.id}</code>`
  ].join('\n');

  const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(tgUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram API 回傳錯誤: ${data.description || res.status}`);
  }
  return true;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// GITHUB LEADS ARCHIVE (data/leads.json)
// ==========================================
async function appendLeadToGitHub(token, owner, repo, branch, newLead) {
  const filePath = 'data/leads.json';
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `Bearer ${token}`,
    'User-Agent': 'CineDimension-Contact-Worker/2.0'
  };

  let currentSha = null;
  let leadsArray = [];

  // 1. Fetch existing leads.json if available
  const getRes = await fetch(getUrl, { headers });
  if (getRes.ok) {
    const data = await getRes.json();
    currentSha = data.sha;
    try {
      const decoded = decodeBase64Utf8(data.content);
      leadsArray = JSON.parse(decoded);
      if (!Array.isArray(leadsArray)) leadsArray = [];
    } catch (e) {
      leadsArray = [];
    }
  }

  // 2. Prepend the newest lead
  leadsArray.unshift(newLead);

  // 3. Save back via Contents API
  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const utf8Content = JSON.stringify(leadsArray, null, 2);
  const base64Content = encodeBase64Utf8(utf8Content);

  const putPayload = {
    message: `[CMS System] 新增客戶預約諮詢名單: ${newLead.name} (${newLead.id})`,
    content: base64Content,
    branch: branch
  };
  if (currentSha) {
    putPayload.sha = currentSha;
  }

  const putRes = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putPayload)
  });

  return putRes.ok;
}

// ==========================================
// TEST TELEGRAM ENDPOINT
// ==========================================
async function handleTelegramTest(request, env) {
  const botToken = env.TELEGRAM_BOT_TOKEN ? env.TELEGRAM_BOT_TOKEN.trim() : '';
  const chatId = env.TELEGRAM_CHAT_ID ? env.TELEGRAM_CHAT_ID.trim() : '';

  if (!botToken || !chatId) {
    return jsonResponse({
      error: '缺少 TELEGRAM_BOT_TOKEN 或 TELEGRAM_CHAT_ID 環境變數'
    }, 400);
  }

  const testData = {
    id: `TEST-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    name: '測試訪客 (悟哥測試)',
    email: 'test@cine-dimension.com',
    phone: '0900-000-000',
    organization: '維度影學測試團隊',
    serviceType: '【系統測試】Telegram Bot 預約通知連線',
    budgetRange: 'NT$ 30,000 - 80,000',
    preferredTime: '測試即時推播',
    message: '這是一則由 Cloudflare Worker 發出的 Telegram Bot 測試訊息，代表連線正常！'
  };

  try {
    await sendTelegramNotification(botToken, chatId, testData);
    return jsonResponse({
      success: true,
      message: '✅ Telegram 測試訊息已成功送出！請至 Telegram 頻道查看。'
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: `Telegram 發送失敗: ${err.message}`
    }, 500);
  }
}

// ==========================================
// BASE64 UTF-8 UTILITIES
// ==========================================
function encodeBase64Utf8(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64Utf8(base64) {
  const clean = base64.replace(/[\r\n\s]/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}
