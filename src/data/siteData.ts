import { FounderInfo, ServiceItem, PortfolioItem, Testimonial } from '../types';
import { STATIC_ASSETS } from '../constants/assets';

export const FOUNDER_INFO: FounderInfo = {
  name: '吳政維',
  nickname: '悟哥',
  title: '維度影學 創辦人 ｜ 18年影視光影講學與實戰導演',
  shortBio: '我是吳政維（悟哥）。18 年前從 Maya 3D 建模與高壓婚禮紀錄踏入影像大門，如今結合手機隨手拍與 AI 工具創辦「維度影學」，受邀竹崎農會、苗栗總工會與大俠攝影教室講學，陪伴學員擺脫完美主義焦慮。',
  education: '18 年影視實戰與 AI 影像賦能導師',
  yearsOfExperience: 18,
  image: STATIC_ASSETS.AVATAR,
  quote: '別讓完美主義偷走你開始的勇氣。\n技術可以被 AI 簡化\n但鏡頭下的溫度無法被取代。',
  taglines: ['先求有，再求好', 'Have Fun 享受創作', '用手機記錄真實的電影感'],
  socials: {
    website: 'https://cine-dimension.com',
    facebook: 'https://www.facebook.com/profile.php?id=100093152435465&mibextid=LQQJ4d',
    instagram: 'https://instagram.com',
    youtube: 'https://www.youtube.com/@cinedimens',
    email: 'hi@cine-dimension.com'
  }
};

export const BRAND_PILLARS = [
  {
    id: 'pillar-1',
    number: '01',
    title: '先求有，再求好',
    subtitle: '打破完美主義，克服鏡頭焦慮',
    description: '許多人買了昂貴相機卻從未開啟第一支影片。悟哥引導你從身邊最熟悉的隨身手機開始，建立最簡單的拍剪微習慣，讓創作不再是心理負擔。',
    iconName: 'Play'
  },
  {
    id: 'pillar-2',
    number: '02',
    title: '光影與美感感知',
    subtitle: '善用自然光線，手機也能拍出質感',
    description: '電影感的核心不是昂貴機身，而是對光線角度、反光板與生活質感的敏銳度。教你利用一扇窗戶、一盞檯燈，拍出專業棚拍般的絲滑光澤。',
    iconName: 'Sun'
  },
  {
    id: 'pillar-3',
    number: '03',
    title: '視覺節奏與情緒',
    subtitle: '18 年婚禮與 MV 剪輯的心流心法',
    description: '如何讓短影音前 3 秒抓住眼球？如何讓畫面隨著音樂呼吸？傳授商業廣告與音樂錄影帶中的節奏心法，讓觀看者產生強烈情感共鳴。',
    iconName: 'Film'
  },
  {
    id: 'pillar-4',
    number: '04',
    title: 'AI 賦能與高效產出',
    subtitle: '科技簡化繁瑣，釋放無限創作力',
    description: '融入 ChatGPT 腳本企劃、自動去背、語音合成與 AI 剪輯工具，讓影片企劃到成片時間縮短 70%，把時間留給最有溫度的創意本質。',
    iconName: 'Sparkles'
  }
];

export const FOUNDER_MILESTONES = [
  {
    year: '2006',
    title: '啟蒙與 3D 建模・影像初探',
    subtitle: '啟蒙恩師 Tom 指引・三維光影初探',
    description: '暑期遇見啟蒙老師 Tom，從 Maya 3D 建模與婚禮紀錄開始踏入影像大門，奠定空間透視與三維光影基礎。',
    iconName: 'Sparkles',
    type: '影像啟蒙'
  },
  {
    year: '2011',
    title: '高壓現場紀實・婚禮團隊',
    subtitle: 'DSLR 動態錄影導入・累積上百場實戰',
    description: '背負重裝單眼與多顆鏡頭與閃光燈，在不可逆的婚禮現場淬煉出對人情溫度、瞬間捕捉與精準控光的敏銳直覺。',
    iconName: 'Camera',
    type: '現場紀實磨練'
  },
  {
    year: '2016-2023',
    title: '商業大片與導演攝影',
    subtitle: 'SHELL 喜力汽車、樂團 MV 製作',
    description: '累積上百場高壓現場走位經驗，擔綱 SHELL 喜力汽車影片與樂團 MV《說不愛就不愛》導演與攝影，建立電影級調色與敘事節奏。',
    iconName: 'Video',
    type: '商業大片製作'
  },
  {
    year: '2024-至今',
    title: '維度影學 ｜ 手機與 AI 講學',
    subtitle: '大俠攝影教室・農會與工會特聘講師',
    description: '創立維度影學，受邀竹崎農會與苗栗總工會擔任特聘講師，結合手機隨手拍與 AI 工具，陪伴上百位學員擺脫完美主義焦慮。',
    iconName: 'Smartphone',
    type: '品牌創立與講學'
  }
];

export const FOUNDER_QUALIFICATIONS_DATA = {
  teaching: {
    title: '專業背景與教學經歷',
    items: [
      {
        main: '大俠攝影教室｜專任特聘講師',
        sub: '專授手機商業攝影、電影感運鏡與 AI 影音創作'
      },
      {
        main: '手機動態影音與 AI 商業實戰系列課程｜主講導師',
        sub: '核心開辦班別：',
        subList: [
          '手機商業攝影與 AI 應用實戰班',
          'AI 輔助動態影音製作訓練班',
          '電商商品攝影實戰班',
          '文創自媒體／微短片製作班'
        ]
      },
      {
        main: '企業與機構內部影音培訓顧問',
        sub: '多媒體設計、商業攝影與短影音製作全流程企業客製內訓'
      },
      {
        main: '嘉義縣竹崎地區農會「手機影音實戰班」特聘講師',
        sub: '輔導在地青農與產銷班將農特產品轉化為高流量商業短影音'
      },
      {
        main: '苗栗縣總工會「產業人才投資方案」特聘講師',
        sub: '執行「提升勞工自主學習計畫」，培育產業影音與 AI 動態實戰人才'
      }
    ]
  },
  capabilities: {
    title: '核心專長領域（攝影實戰 × AI 智能工作流）',
    categories: [
      {
        title: '商業動靜態影像創作',
        desc: '商業攝影、人像／婚紗寫真、空間建築攝影、器材評測與多媒體設計。'
      },
      {
        title: '專業級影音剪輯與後製工作流',
        desc: '精通 Premiere、Final Cut Pro、Motion 5 等跨世代剪輯與動態特效工具。'
      },
      {
        title: '新一代 AI 影像賦能工作流',
        isAi: true,
        features: [
          {
            name: 'AI 虛擬棚拍與商業人像生成',
            desc: '告別高昂棚拍成本——單張素顏生活照，精準生成高質感商業級專業棚拍形象照。'
          },
          {
            name: 'AI 劇本驅動影音自動化管線',
            desc: '從概念腳本出發，AI 自動化生成連貫分鏡、配音與敘事結構，打造高轉化商業故事短片。'
          },
          {
            name: 'AI 跨界聯名行銷全流程（Concept to Landing Page）',
            desc: '突破產品框架——透過 AI 智能萃取兩款異業產品精髓，自動生成跨界聯名企劃、視覺包裝與行銷落地頁（Landing Page）。'
          }
        ]
      }
    ]
  },
  trackRecord: {
    title: '代表實績與特約合作',
    groups: [
      {
        category: 'B2B 概念視覺化與跨境電商實績',
        items: [
          {
            name: 'Amazon 跨境電商短影音',
            desc: 'Ballpen（鋼珠筆）產品賣點短片操刀（精準放大細節質感，有效提升商品點擊與購買轉換）。'
          },
          {
            name: '沉香精品短影音',
            desc: '將抽象氣味與東方意境「視覺具象化」之動態呈現，展現高奢沈浸美學。'
          }
        ]
      },
      {
        category: '指標機構與大型論壇特約',
        items: [
          {
            name: '台北市進出口商業同業公會',
            desc: '數位應用高峰會特約攝影師、空間租借商業空間攝影。'
          },
          {
            name: '高雄大連商圈',
            desc: '官方特約商業攝影師。'
          },
          {
            name: '房仲與建案開幕儀式',
            desc: '新案開賣動態與靜態特約記錄。'
          },
          {
            name: '台灣殼牌 SHELL 喜力汽車',
            desc: '官方車輛保修 App 操作指南與情境形象引導片導演。'
          },
          {
            name: '獨立樂團 MV《說不愛就不愛》',
            desc: '官方音樂錄影帶導演、攝影與調色。'
          }
        ]
      }
    ]
  }
};

export const AUDIENCE_PAIN_POINTS = [
  {
    target: '地方青農與在地品牌創辦人',
    situation: '自家農特產品質極佳，但用手機拍照總是像隨手拍，無法呈現產地新鮮感與職人故事。',
    wuMessage: '「嘉義竹崎農會的青農大哥們，上完課後用晨光拍出柳丁上的露水，影片發布後訂單直接爆滿。你不需要買單眼，光是找對窗光與角度，手機就能拍出垂涎感！」',
    badge: '在地農產與工藝品牌'
  },
  {
    target: '中小企業行銷與社群小編',
    situation: '老闆要求天天產出短影音，但企劃腳本寫不出、剪輯軟體太複雜，耗費一整天產出一支無人觀看的影片。',
    wuMessage: '「我教你用 ChatGPT 30秒產出符合黃金 3 秒 hook 的腳本範本，再用手機快剪模板，10 分鐘內搞定高質感直式短片。」',
    badge: '企業行銷與社群團隊'
  },
  {
    target: '個人自媒體與生活記錄創作者',
    situation: '買了昂貴的相機與穩定器，卻因為太重懶得帶出門；看著別人的影片很羨慕，自己卻總覺得拍不好。',
    wuMessage: '「最好的相機就是你口袋裡那台！放下完美主義，跟我一起在散步、喝咖啡時隨手練習運鏡，Have Fun 才是創作能走長遠的秘密。」',
    badge: '個人創作者與生活玩家'
  },
  {
    target: '需要高品質商業形象的企業創辦人',
    situation: '市面上影視製作公司報價高昂且溝通成本巨大，擔心拍出來的形象片冰冷沒有靈魂。',
    wuMessage: '「18 年婚禮與商業大片經驗，我親自為您的品牌梳理核心故事，以導演視角打造有溫度、能替企業說話的視覺大片。」',
    badge: '商業大片與品牌顧問'
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'mobile-cine-course',
    title: '《維度影學：手機拍出電影感》系統課',
    subtitle: '零基礎也能學會的手機商業光影、運鏡與調色全攻略',
    category: 'course',
    categoryLabel: '線上旗艦課程',
    tagline: '口袋裡的電影院，隨手拍出生活與商品的呼吸感',
    duration: '共 12 單元 ｜ 360 分鐘系統教學',
    format: '線上系統課',
    targetAudience: ['自媒體創作者', '個人品牌經營者', '生活紀錄愛好者', '手作與甜點工作室創辦人'],
    description: '從手機相機參數最佳化設定、自然光與人造光佈局，到推拉搖移的電影感運鏡美學。悟哥以 18 年實戰經驗拆解，不講深奧名詞，只教最接地氣的實戰手法。',
    highlights: [
      '破解手機感光元件限制，拍出柔美景深與層次',
      '掌握「三維光影法」，讓平淡商品瞬間具備商業高級感',
      '內含 20 組經典運鏡走位圖解與拍剪節奏清單',
      '專屬學員群作業點評與一對一問題解惑'
    ],
    modules: [
      { title: '第一章：打破器材迷思與手機相機調校', description: '解析度、幀率、曝光鎖定與白平衡正確設定' },
      { title: '第二章：光影的魔法——從自然光到生活控光', description: '窗光、反光板與百元道具拍出千元商業質感' },
      { title: '第三章：電影感運鏡走位與視覺心流', description: '一鏡到底、特寫節奏與黃金 3 秒鉤子設計' },
      { title: '第四章：高效率手機調色與聲音設計', description: '冷暖色調氛圍營造、BGM 襯樂與環境音降噪' }
    ],
    featured: true,
    priceTag: '熱門推薦',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ai-video-camp',
    title: '《AI 輔助動態影音速成訓練營》',
    subtitle: '結合 ChatGPT 與 AI 剪輯工具，產出效率翻倍',
    category: 'ai_workshop',
    categoryLabel: 'AI 創新工作坊',
    tagline: '讓 AI 幫你寫腳本、挑音樂、自動去背，釋放創作生產力',
    duration: '單日 6 小時高強度實作營 / 線上 4 週陪跑',
    format: '實體工作坊',
    targetAudience: ['社群行銷人員', '電商運營團隊', '自媒體加速期創作者', '中小企業主'],
    description: '手把手教你如何將生成式 AI 導入影音製作流程。從運用專屬 Prompt 產出爆款短影片腳本，到 AI 語音旁白、自動字幕生成與智慧素材庫建置，徹底告別產能焦慮。',
    highlights: [
      '獨家贈送「悟哥 50 組影音爆款 Prompt 秘笈庫」',
      '學會 AI 腳本生成、分鏡提示詞與標題 SEO 撰寫',
      '實作 AI 去背、智慧配樂與一鍵字幕工作流',
      '現場帶領每位學員產出 2 支完整短影音作品'
    ],
    modules: [
      { title: '模組一：AI 腳本構想與黃金鉤子設計', description: '用 ChatGPT 快速產出具有高留存率的分鏡腳本' },
      { title: '模組二：手機快速實拍與素材管理', description: '依照 AI 腳本快速完成 10 分鐘素材拍攝' },
      { title: '模組三：AI 工具鏈整合與剪輯加速', description: '結合 CapCut, Whisper 等工具實現極速出片' }
    ],
    featured: true,
    priceTag: '好評熱銷',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'enterprise-training',
    title: '農會・企業・機構客製影音內訓',
    subtitle: '針對在地農特產、企業產品之手機商業實戰培訓',
    category: 'enterprise',
    categoryLabel: '企業與機構內訓',
    tagline: '專為非專業背景團隊打造，用手機打開商業影響力',
    duration: '客製化半天/全天/多單元班',
    format: '企業內訓',
    targetAudience: ['地方農會與青農團體', '中小企業行銷團隊', '文創自媒體培訓班', '公家機關與教育單位'],
    description: '曾為嘉義縣竹崎地區農會等在地機構量身打造「手機商業拍攝與 AI 應用實戰班」。針對農特產品、手作工藝或企業服務，教導學員如何在現場自然光環境下拍出令人垂涎流口水的商品特寫與高轉換短影音。',
    highlights: [
      '嘉義竹崎農會等多家單位實戰好評認證',
      '商品商業拍攝佈光與道具擺設秘訣',
      '專為無基礎員工設計的傻瓜化拍剪 SOP',
      '包含課後作業審查與團隊實作成果評比'
    ],
    modules: [
      { title: '單元一：商品與人物美感佈光', description: '窗光運用、補光板道具、商品質感紋理呈現' },
      { title: '單元二：商業短影片故事架構', description: '產品賣點轉化為視覺語言，引發顧客購買慾' },
      { title: '單元三：團隊高效協同剪輯', description: '建立企業內部短影音產出範本與素材庫' }
    ],
    featured: false,
    priceTag: '機構首選',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'commercial-consulting',
    title: '商業影像顧問與客製化拍攝',
    subtitle: '品牌形象大片、宣傳片指導與高質感商業攝影',
    category: 'consulting',
    categoryLabel: '商業影像顧問',
    tagline: '18 年實戰經驗，打造能說話、有溫度的專屬大片',
    duration: '依專案規劃與拍攝天數計',
    format: '一對一顧問',
    targetAudience: ['企業品牌創辦人', '建案與餐飲品牌', '樂團與藝文團體', '需要高端形象片的創業者'],
    description: '承襲 Shell 官方 App 形象片、不寂寞樂團 MV《說不愛就不愛》、建案大片等頂級製作標準。悟哥親自擔任顧問與導演，從前期的品牌故事梳理、分鏡腳本設計到現場燈光美學與後製調光調音。',
    highlights: [
      'Shell 官方 App、樂團 MV 與建案大片導演團隊',
      '深度梳理品牌靈魂與視覺識別系統',
      '提供從劇本、導演、拍攝到後製一條龍服務',
      '亦可提供「現場拍攝指導」輔導企業內部團隊'
    ],
    modules: [
      { title: '階段一：品牌故事與定調', description: '前置訪談、視覺情緒板 (Moodboard) 建立' },
      { title: '階段二：專業製作與執行', description: '燈光組、攝影組、現場高壓高效調度' },
      { title: '階段三：電影級後製調色', description: '達芬奇/FCPX 專業調色與音樂音效混音' }
    ],
    featured: false,
    priceTag: '專案審查',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
  }
];

export const SERVICES_LIST = SERVICES_CATALOG;

export const PORTFOLIO_CASES: PortfolioItem[] = [
  {
    id: 'zhuqi-farmers-association',
    title: '嘉義縣竹崎地區農會「手機影音實戰班」',
    category: '教育培訓與在地品牌',
    clientOrProject: '嘉義縣竹崎地區農會',
    year: '2023-2024',
    description: '擔任主要講師，帶領在地青農與電商學員，運用手機拍攝高品質農特產品特寫與行銷短影片，打造在地農業數位轉型標竿。',
    role: '影音課程總教練',
    tags: ['手機攝影', '農會內訓', 'AI影音應用', '品牌行銷'],
    image: 'https://img.youtube.com/vi/_JjmH05QYlU/hqdefault.jpg',
    videoUrl: 'https://youtu.be/_JjmH05QYlU',
    highlights: ['輔導超過 50 位青農產出自家水果短影片', '滿意度高達 98%，學員後續觸及率提升顯著']
  },
  {
    id: 'kaohsiung-qijin-travel-film',
    title: '高雄旗津「用手機凝結老友情誼與港都光影」',
    category: '手機錄影創作 / 旅行生活',
    clientOrProject: '課後隨拍創作',
    year: '2023',
    description: '走訪高雄，與多年老友搭上輕軌漫遊旗津。在沙灘、陽光與海鮮美味的交錯間，不帶笨重器材，純粹以手機運鏡與自然光影，將久違重逢的笑聲與微醺時光，轉化為具備電影質感的旅行影像紀錄。',
    role: '手機動態攝影師 / 剪輯後製',
    tags: ['手機錄影', '旅行紀錄', '高雄旗津', '動態運鏡'],
    image: 'https://img.youtube.com/vi/eFJcTN9lt9s/hqdefault.jpg',
    videoUrl: 'https://youtu.be/eFJcTN9lt9s',
    highlights: [
      '不帶笨重器材，純粹以手機運鏡與自然光影捕捉老友情誼',
      '將沙灘、陽光與港都漫遊轉化為具備電影質感的旅行影像紀錄'
    ]
  },
  {
    id: 'jimo-ancient-city-film',
    title: '山東即墨古城「千年文脈與現代鏡頭的對話」',
    category: '人文景觀錄影 / 建築光影',
    clientOrProject: '人文旅讀影像',
    year: '2019',
    description: '走訪擁有 1400 餘年建城史的山東即墨古城。穿梭於古縣衙、文廟、牌坊與考院之間，透過細膩的手持運鏡與光影捕捉，將「一城、兩街、十景、十三坊」的磅礴格局收錄鏡底，重現古人科舉與生活的歷史厚度。',
    role: '動態錄影師 / 視覺企劃與剪輯',
    tags: ['建築攝影', '人文紀錄', '即墨古城', '動態運鏡'],
    image: 'https://img.youtube.com/vi/G09UZtpbyN0/hqdefault.jpg',
    videoUrl: 'https://youtu.be/G09UZtpbyN0',
    highlights: [
      '細膩手持運鏡與光影捕捉，收錄「一城、兩街、十景、十三坊」磅礴格局',
      '重現 1400 餘年古城歷史厚度與文脈風華'
    ]
  },
  {
    id: 'band-mv-music-video',
    title: '樂團 MV《說不愛就不愛》',
    category: '音樂錄影帶 MV / 電影感敘事',
    clientOrProject: '不寂寞樂團 x 阿京',
    year: '2018',
    description: '一手包辦現場攝影、氛圍燈光與剪輯後製，運用極致的情緒光影與強烈節奏感剪輯，完美詮釋歌曲的情感沉澱與故事張力。',
    role: '導演 / 攝影師 / 剪輯師',
    tags: ['音樂MV', '情緒調色', '節奏剪輯', '電影感視覺'],
    image: 'https://img.youtube.com/vi/5p7nMVHx-AE/hqdefault.jpg',
    videoUrl: 'https://youtu.be/5p7nMVHx-AE?si=BHl1KkzmHCa2CxKw',
    highlights: ['暗色調微光鏡頭極具電影氛圍', '流暢的節奏切換使歌曲觀看體驗大幅提升']
  },
  {
    id: 'shell-lubricants-ad',
    title: 'Shell 喜力汽車｜官方車輛保修 App 操作指南與情境形象引導片',
    category: '商業形象片 / App 功能情境演示 / 專業保修引導',
    clientOrProject: '台灣殼牌 Shell Lubricants & Digital Solutions',
    year: '2015',
    description: '為全球潤滑油領導品牌 Shell 喜力汽車量身打造「車輛保修 App 官方操作與情境指南」。透過車主保養實境與清晰流暢的 App 介面操作演示，將繁複的預約維修、履歷查詢與保養檢測流程轉化為直覺易懂的影像語言，有效降低車主操作門檻，引導用戶精準掌握 App 核心功能，全面提升品牌數位服務體驗與滿意度。',
    role: '動態導演 / 商業動態攝影 / 介面情境演示指導',
    tags: ['商業形象片', 'App操作指南', '情境演示', '保修實境', '降低學習門檻'],
    image: STATIC_ASSETS.PORTFOLIO_FALLBACK_THUMBNAIL,
    highlights: [
      '實境操作無縫結合：將保修廠情境與手機 App 介面無縫串聯，讓車主一目了然各項維修保養功能',
      '降低學習門檻：以電影感光影與精準節奏演示，將複雜的工具型 App 轉化為生動直覺的導覽體驗'
    ]
  },
  {
    id: 'wedding-films-collection',
    title: '婚禮團隊 - 上百場溫暖婚禮電影紀錄',
    category: '婚禮電影記錄 / 人像紀實',
    clientOrProject: '百位新人人生大事紀錄',
    year: '2006-2020',
    description: '在極高壓、不可逆的現場環境下捕捉最真摯的人情溫度，運用敏銳的鏡頭語言與光影美學留下永恆的感動瞬間。',
    role: '資深攝影師 / 動態錄影師',
    tags: ['婚禮紀錄', '人像光影', '情緒捕捉', '現場實戰'],
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=owTBrg-aBhE&list=PL8OpV9U_sLi90w5HHO3AVOY0FBn4LYHsx&index=2',
    highlights: ['跨越靜態至動態錄影百場實戰經驗', '深厚的人像情感引導與自然光影敏銳度']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: '張小姐',
    role: '手作甜點品牌創辦人',
    organization: '莫內法式甜點',
    quote: '「以前每次想做社群短影片，光是擺設備、對焦就搞到天黑，最後放棄。上完悟哥的《手機拍出電影感》課程後，我才發現原來用陽台的自然光加手機，5分鐘就能拍出蛋糕絲滑質感！」',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    serviceUsed: '《維度影學：手機拍出電影感》系統課',
    tags: ['美食拍攝', '零基礎突破', '高效拍剪']
  },
  {
    id: 't2',
    name: '林大哥',
    role: '在地返鄉青農',
    organization: '嘉義竹崎高山果園',
    quote: '「悟哥教學非常有耐心，完全不講難懂的專業術語！他教我們怎麼用手機走位，拍攝水果上的露水。課程結束後我發的第一支柑橘短影片點閱率直接破萬，太感謝了！」',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    serviceUsed: '嘉義竹崎農會手機商業拍攝班',
    tags: ['農特產行銷', '接地氣教學', '實用性極高']
  },
  {
    id: 't3',
    name: 'Chen Video Specialist',
    role: '行銷總監',
    organization: '文創設計公司',
    quote: '「悟哥的『Have Fun』教學理念改變了我們團隊的創作節奏。 AI 輔助課程讓我們社群短影音企劃時間減少了一半以上，視覺質感反而大躍進。」',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    serviceUsed: '《AI 輔助動態影音速成訓練營》',
    tags: ['AI工具應用', '團隊產能提升', '品牌高質感']
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: '請問您目前創作影音最大的困擾是？',
    options: [
      { label: '總是覺得設備不夠好，不知從何下手', recommendId: 'mobile-cine-course' },
      { label: '剪輯耗時費力，想用 AI 提升產出速度', recommendId: 'ai-video-camp' },
      { label: '團隊或單位需要商業拍攝與商品短影片行銷', recommendId: 'enterprise-training' },
      { label: '需要高質感的品牌形象大片或客製專案拍攝', recommendId: 'commercial-consulting' }
    ]
  },
  {
    id: 2,
    question: '您平常主要使用什麼器材進行拍攝？',
    options: [
      { label: '完全使用隨身 iPhone / Android 手機', recommendId: 'mobile-cine-course' },
      { label: '電腦 + 手機 + 想要導入 AI 生成工具', recommendId: 'ai-video-camp' },
      { label: '團體/員工的手機與基礎燈光道具', recommendId: 'enterprise-training' },
      { label: '希望能有專業導演團隊協助拍攝大片', recommendId: 'commercial-consulting' }
    ]
  }
];
