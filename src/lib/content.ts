export type Lang = "en" | "zh";
export type L = { en: string; zh: string };

export const person = {
  name: "Tan Keng Ting",
  handle: "EdwardJT",
  email: "kengtingtan@gmail.com",
  github: "https://github.com/JTing904",
  githubLabel: "github.com/JTing904",
  instagram: "https://www.instagram.com/jtinnnng/",
  instagramLabel: "@jtinnnng",
  city: { en: "Seremban, Malaysia", zh: "马来西亚 · 芙蓉" },
  role: { en: "Software engineering undergraduate", zh: "软件工程本科生" },
  intro: {
    en: "I build apps that handle money, and the servers behind them.",
    zh: "我做跟钱有关的 App，也写它们背后的服务器。",
  },
  status: { en: "Open to backend and mobile internships", zh: "正在找后端 / 移动端实习" },
};

/** The statement section is lit word by word as you scroll. Keep it short and true. */
export const statement: L = {
  en: "Kotlin and Spring Boot on the server. React and Jetpack Compose on the client. Money is kept in whole cents or BigDecimal, and never in a float.",
  zh: "服务端写 Kotlin 和 Spring Boot，客户端写 React 和 Jetpack Compose。金额只用整数分或 BigDecimal 存，从来不用浮点数。",
};

export type Project = {
  id: string;
  name: string;
  year: string;
  kind: L;
  line: L;
  stack: string[];
  href?: string;
  site?: string;
};

export const projects: Project[] = [
  {
    id: "orbitoffice",
    name: "OrbitOffice",
    year: "2026",
    kind: { en: "Windows desktop app · open source · v0.1", zh: "Windows 桌面应用 · 开源 · v0.1" },
    line: {
      en: "Build your own AI office. Describe the work and AI sets up departments of agents in one 3D world; they split tasks, hand off to each other and write real files into your folder. Runs on free API keys or a built-in local model, and its MCP server lets Claude Code assign the team work.",
      zh: "搭建你自己的 AI 办公室。描述要做的事，AI 就在一个 3D 世界里建好各个部门和员工；它们分工、互相交接，把真实文件写进你的文件夹。可以用免费 API key 或内置的本地模型，还自带 MCP 服务器，让 Claude Code 直接给团队派活。",
    },
    stack: ["Electron", "Three.js", "Blender", "MCP server", "Local LLMs", "Node.js"],
    href: "https://github.com/JTing904/OrbitOffice",
    site: "https://jting904.github.io/OrbitOffice",
  },
  {
    id: "dividend",
    name: "Dividend Stream",
    year: "2026",
    kind: { en: "Android · Windows · REST API", zh: "Android · Windows · REST API" },
    line: {
      en: "An expected dividend, shown building up second by second. The server stores a rate and a window; every client works the figure out from the clock.",
      zh: "把一笔预期股息按秒累积着显示出来。服务器只存速率和时间区间，客户端按时钟自己算出数字。",
    },
    stack: ["Kotlin", "Spring Boot", "PostgreSQL", "Flyway", "JWT", "Jetpack Compose", "Compose Desktop"],
    href: "https://github.com/JTing904/Dividend-Stream",
  },
  {
    id: "meritai",
    name: "MeritAI",
    year: "2026",
    kind: { en: "Android · web · iPhone PWA · in development", zh: "Android · 网页 · iPhone PWA · 开发中" },
    line: {
      en: "Fair group projects. The brief becomes tasks worth 100 points, split into one equal package per member; people hand in evidence and the lead grades it. AI task splitting and review are next.",
      zh: "让小组作业分工公平。作业拆成共 100 分的任务，按人数平均分包；成员交证据，组长评级。AI 拆任务和 AI 审核是下一步。",
    },
    stack: ["Expo", "React Native", "TypeScript", "Hono", "Prisma", "PostgreSQL", "Zod", "Vitest"],
    href: "https://github.com/JTing904/MeritAI",
  },
  {
    id: "savvypiggy",
    name: "SavvyPiggy",
    year: "2026",
    kind: { en: "Android · v2.0", zh: "Android · v2.0" },
    line: {
      en: "Every ringgit in its place. One deposit is split across your goals in whole cents, borrowed money is cleared first, and Bursa investing stays separate. v2.0 adds a wallet, bills, receipts and debts with interest.",
      zh: "每一块钱都有去处。一笔存款按比例分进各个目标，全用整数「分」计算；借的钱先还，Bursa 投资单独分开。v2.0 加了钱包、账单、收据和带利息的欠款。",
    },
    stack: ["React 19", "TypeScript", "Vite", "Capacitor", "Firebase", "Cloudflare Workers"],
    href: "https://github.com/JTing904/SavvyPiggy",
    site: "https://jting904.github.io/SavvyPiggy",
  },
  {
    id: "ml",
    name: "Performance Prediction",
    year: "2026",
    kind: { en: "AI coursework · team of 3", zh: "AI 课程作业 · 三人小组" },
    line: {
      en: "Classifies students as low, medium or high performers from 19 features. I built the logistic regression model and compared it with a decision tree and KNN.",
      zh: "用 19 个特征把学生成绩分成低、中、高三类。逻辑回归是我做的，并和决策树、KNN 做对比。",
    },
    stack: ["Python", "pandas", "scikit-learn", "Matplotlib"],
  },
];

/** Cards in the carousel. `src` cards are real screenshots; `cover` cards are drawn in the DOM. */
export type Card =
  | { kind: "shot"; project: string; src: string; label: L; wide?: boolean }
  | { kind: "cover"; project: string; label: L; colors: [string, string, string] };

export const cards: Card[] = [
  { kind: "shot", project: "orbitoffice", src: "work/orbit-world.webp", label: { en: "Two departments, one world", zh: "两个部门，同一个世界" }, wide: true },
  { kind: "shot", project: "orbitoffice", src: "work/orbit-software.webp", label: { en: "Software team", zh: "软件团队" }, wide: true },
  { kind: "shot", project: "orbitoffice", src: "work/orbit-marketing.webp", label: { en: "Marketing agency", zh: "营销公司" }, wide: true },
  { kind: "shot", project: "orbitoffice", src: "work/orbit-builder.webp", label: { en: "AI office builder", zh: "AI 建办公室" }, wide: true },
  { kind: "shot", project: "dividend", src: "work/dividend-live.webp", label: { en: "Live dividends", zh: "实时股息" } },
  { kind: "shot", project: "dividend", src: "work/dividend-home.webp", label: { en: "Home", zh: "首页" } },
  { kind: "shot", project: "dividend", src: "work/dividend-portfolio.webp", label: { en: "Portfolio", zh: "持仓" } },
  { kind: "shot", project: "meritai", src: "work/meritai-home.webp", label: { en: "Home", zh: "首页" } },
  { kind: "shot", project: "meritai", src: "work/meritai-packages.webp", label: { en: "Pick a package", zh: "选任务包" } },
  { kind: "shot", project: "meritai", src: "work/meritai-review.webp", label: { en: "Task review", zh: "审核结果" } },
  { kind: "shot", project: "meritai", src: "work/meritai-leaderboard.webp", label: { en: "Leaderboard", zh: "排行榜" } },
  { kind: "shot", project: "savvypiggy", src: "work/savvypiggy-home.webp", label: { en: "Home", zh: "首页" } },
  { kind: "shot", project: "savvypiggy", src: "work/savvypiggy-strategy.webp", label: { en: "Strategy", zh: "策略" } },
  { kind: "shot", project: "savvypiggy", src: "work/savvypiggy-report.webp", label: { en: "Report", zh: "报表" } },
  { kind: "cover", project: "ml", label: { en: "Logistic regression", zh: "逻辑回归" }, colors: ["#3B2BD9", "#E0467C", "#12112B"] },
];

export const skills: { group: L; items: string[] }[] = [
  { group: { en: "Server", zh: "服务端" }, items: ["Kotlin", "Spring Boot", "Hono", "PostgreSQL", "Prisma", "Cloudflare Workers", "MCP servers"] },
  { group: { en: "Client", zh: "客户端" }, items: ["React 19", "React Native", "Expo", "TypeScript", "Next.js", "Electron", "Three.js", "Jetpack Compose"] },
  { group: { en: "Data", zh: "数据" }, items: ["Python", "pandas", "scikit-learn", "SQL (Oracle)", "Firebase"] },
  { group: { en: "Craft", zh: "工程" }, items: ["Java", "Vitest", "Zod", "Git", "GitHub Actions", "Gradle", "Figma"] },
];

export const journey: { when: string; what: L; where: L }[] = [
  { when: "2026 —", what: { en: "BSc (Hons) Software Engineering", zh: "软件工程荣誉学士" }, where: { en: "TAR UMT, Kuala Lumpur", zh: "拉曼理工大学，吉隆坡" } },
  { when: "2026", what: { en: "System Support Technician", zh: "系统支持技术员" }, where: { en: "MEVO Sdn Bhd · Jan – May", zh: "MEVO Sdn Bhd · 1 月 – 5 月" } },
  { when: "2024 — 26", what: { en: "Diploma in Computer Science · CGPA 3.2", zh: "计算机科学文凭 · CGPA 3.2" }, where: { en: "TAR UMT, Kuala Lumpur", zh: "拉曼理工大学，吉隆坡" } },
  { when: "2024 — 26", what: { en: "Member, Computer Science Society", zh: "计算机科学学会 会员" }, where: { en: "TAR UMT", zh: "拉曼理工大学" } },
  { when: "2023", what: { en: "Cashier", zh: "收银员" }, where: { en: "Zemart Supermarket · Mar – Jun", zh: "Zemart 超市 · 3 月 – 6 月" } },
];

export const ui = {
  work: { en: "Work", zh: "作品" },
  about: { en: "About", zh: "关于" },
  contact: { en: "Contact", zh: "联系" },
  loading: { en: "Loading", zh: "加载中" },
  scroll: { en: "Scroll", zh: "向下滚动" },
  local: { en: "Local time", zh: "当地时间" },
  drag: { en: "Scroll or drag", zh: "滚动或拖动" },
  source: { en: "Source", zh: "源码" },
  website: { en: "Website", zh: "网站" },
  accrualTitle: { en: "Accrued since you arrived", zh: "你打开这页之后累积的" },
  accrualNote: {
    en: "This is the counter from Dividend Stream, with its own example: RM320.00 earned over 182 days. Nothing is written per second. Each client computes it from the clock, rounded down so an unpaid amount is never overstated.",
    zh: "这是 Dividend Stream 里的计数器，用的是它自带的例子：182 天里赚到的 RM320.00。没有任何东西每秒写入数据库。每个客户端按时钟自己算，并且向下取整，未到账的金额永远不会被高估。",
  },
  skillsTitle: { en: "What I build with", zh: "我用什么做" },
  journeyTitle: { en: "Study and work", zh: "学习与工作" },
  say: { en: "Write to me", zh: "写信给我" },
  copy: { en: "Copy", zh: "复制" },
  copied: { en: "Copied", zh: "已复制" },
};
