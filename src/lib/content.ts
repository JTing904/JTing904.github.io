export type Lang = "en" | "zh";
export type L = Record<Lang, string>;

export const profile = {
  name: "Tan Keng Ting",
  handle: "EdwardJT",
  github: "https://github.com/JTing904",
  email: "kengtingtan@gmail.com",
  location: { en: "Seremban, Malaysia", zh: "马来西亚 · 芙蓉" } satisfies L,
  role: {
    en: "Software Engineering Undergraduate",
    zh: "软件工程在读本科生",
  } satisfies L,
  tagline: {
    en: "I ship mobile and web apps, and the APIs behind them.",
    zh: "写移动端和 Web 应用，也写它们背后的 API。",
  } satisfies L,
  about: {
    en: "Computer Science diploma holder now reading for a Bachelor of Software Engineering at TAR UMT. Kotlin and Spring Boot on the server, React and Jetpack Compose on the client, Python when the problem is data. I care most about getting money arithmetic right and about learning frameworks faster than the syllabus asks me to.",
    zh: "计算机科学文凭毕业，现在在 TAR UMT 读软件工程荣誉学士。服务端写 Kotlin + Spring Boot，客户端写 React 和 Jetpack Compose，遇到数据问题就用 Python。最在意的是把跟钱有关的算术做对，以及比课纲更快地去啃新框架。",
  } satisfies L,
  spoken: [
    { en: "English", zh: "英语" },
    { en: "Bahasa Malaysia", zh: "马来语" },
    { en: "Mandarin", zh: "华语" },
  ] satisfies L[],
};

/** Self-rated, shown as a character sheet — honest, not inflated. */
export const stats: { key: L; value: number }[] = [
  { key: { en: "Mobile / Android", zh: "移动端 / Android" }, value: 76 },
  { key: { en: "Backend", zh: "后端" }, value: 70 },
  { key: { en: "Web", zh: "Web 前端" }, value: 62 },
  { key: { en: "Data & AI", zh: "数据与 AI" }, value: 60 },
  { key: { en: "Databases", zh: "数据库" }, value: 66 },
];

export type SkillNode = {
  id: string;
  label: string;
  tier: number;
  branch: "lang" | "web" | "mobile" | "backend" | "data" | "craft";
  note: L;
};

/**
 * Every node here is backed by code in a repository of mine. Nothing is listed
 * because it looks good on a CV — if it is on this tree, I have shipped with it.
 */
export const skills: SkillNode[] = [
  { id: "java", label: "Java", tier: 0, branch: "lang", note: { en: "Hotel management system — abstract Person, Guest/Employee subclasses, six manager classes.", zh: "酒店管理系统 —— 抽象类 Person，Guest / Employee 子类，六个 manager 类。" } },
  { id: "python", label: "Python", tier: 0, branch: "lang", note: { en: "ML coursework, a pygame tower defence, tkinter particle renderers.", zh: "机器学习作业、pygame 塔防、tkinter 粒子渲染。" } },
  { id: "kotlin", label: "Kotlin", tier: 1, branch: "lang", note: { en: "Both halves of Dividend Stream — the Spring Boot API and the Android app.", zh: "Dividend Stream 的两端 —— Spring Boot 后端和 Android 客户端。" } },
  { id: "ts", label: "TypeScript", tier: 1, branch: "lang", note: { en: "SavvyPiggy, a Next.js finance tracker, and this site.", zh: "SavvyPiggy、一个 Next.js 记账应用，还有这个网站。" } },
  { id: "sql", label: "SQL", tier: 1, branch: "lang", note: { en: "Oracle DDL with foreign keys, CHECK + REGEXP_LIKE constraints, and SQL*Plus reports.", zh: "Oracle 建表：外键、CHECK + REGEXP_LIKE 约束，加 SQL*Plus 报表。" } },

  { id: "html", label: "HTML / CSS", tier: 0, branch: "web", note: { en: "Semantics first. Then modern layout, custom properties, scroll-driven animation.", zh: "先把语义写对，再谈现代布局、CSS 变量、滚动驱动动画。" } },
  { id: "js", label: "JavaScript", tier: 0, branch: "web", note: { en: "DOM, async, Web Workers — the playground on this page runs in one.", zh: "DOM、异步、Web Worker —— 这页的代码沙箱就跑在里面。" } },
  { id: "react", label: "React 19", tier: 1, branch: "web", note: { en: "SavvyPiggy's entire UI, and every component on this site.", zh: "SavvyPiggy 的整个界面，以及这个网站的每一个组件。" } },
  { id: "tailwind", label: "Tailwind", tier: 1, branch: "web", note: { en: "v3 in SavvyPiggy, v4 with the CSS-first @theme block here.", zh: "SavvyPiggy 用 v3，这里用 v4 的 CSS-first @theme。" } },
  { id: "vite", label: "Vite", tier: 1, branch: "web", note: { en: "SavvyPiggy's build — Vite 6 with the React plugin.", zh: "SavvyPiggy 的构建 —— Vite 6 加 React 插件。" } },
  { id: "next", label: "Next.js", tier: 2, branch: "web", note: { en: "App Router. A finance tracker, and this site as a static export.", zh: "App Router。一个记账应用，还有这个静态导出的网站。" } },

  { id: "android", label: "Android SDK", tier: 0, branch: "mobile", note: { en: "minSdk 24-26, targetSdk 36, Gradle wrapper builds, real-device APKs.", zh: "minSdk 24–26、targetSdk 36，Gradle wrapper 构建，真机 APK。" } },
  { id: "compose", label: "Jetpack Compose", tier: 1, branch: "mobile", note: { en: "PetHub and Dividend Stream — navigation-compose, state hoisting, no XML layouts.", zh: "PetHub 和 Dividend Stream —— navigation-compose、状态提升，完全不用 XML 布局。" } },
  { id: "material", label: "Material 3", tier: 1, branch: "mobile", note: { en: "Theming, typography scale, and components straight from the M3 library.", zh: "主题、字号体系，组件直接用 M3 库。" } },
  { id: "capacitor", label: "Capacitor", tier: 1, branch: "mobile", note: { en: "SavvyPiggy ships as a real APK — filesystem, share sheet, local notifications.", zh: "SavvyPiggy 打成真正的 APK —— 文件系统、分享、本地通知。" } },
  { id: "mvvm", label: "MVVM", tier: 2, branch: "mobile", note: { en: "Dividend Stream's Android client. ViewModels own state; the UI just draws it.", zh: "Dividend Stream 的 Android 端。状态归 ViewModel，UI 只负责画。" } },

  { id: "spring", label: "Spring Boot", tier: 2, branch: "backend", note: { en: "Dividend Stream's REST API in Kotlin — the source of truth for both clients.", zh: "Dividend Stream 的 Kotlin REST API —— 两个客户端共同的真相来源。" } },
  { id: "postgres", label: "PostgreSQL", tier: 2, branch: "backend", note: { en: "NUMERIC columns for money. Tests run against a real in-process Postgres, not H2.", zh: "金额用 NUMERIC。测试跑在进程内真实 Postgres 上，不是 H2。" } },
  { id: "flyway", label: "Flyway", tier: 2, branch: "backend", note: { en: "Versioned migrations, applied identically in dev and in test.", zh: "版本化迁移，开发和测试跑同一套。" } },
  { id: "jwt", label: "JWT auth", tier: 2, branch: "backend", note: { en: "Access + rotating refresh tokens. Every query is scoped by the id in the token.", zh: "访问令牌 + 轮换刷新令牌。每个查询都按令牌里的 id 限定范围。" } },
  { id: "rest", label: "REST design", tier: 1, branch: "backend", note: { en: "Amounts travel as JSON strings, because a JSON number is a double.", zh: "金额用 JSON 字符串传，因为 JSON number 就是 double。" } },
  { id: "firebase", label: "Firebase", tier: 1, branch: "backend", note: { en: "SavvyPiggy: Auth + Firestore, with security rules tested by assertion.", zh: "SavvyPiggy：Auth + Firestore，安全规则用断言测过。" } },

  { id: "jupyter", label: "Jupyter", tier: 0, branch: "data", note: { en: "Where the AI coursework actually lives — three notebooks, one per model.", zh: "AI 作业真正待的地方 —— 三个 notebook，一个模型一本。" } },
  { id: "pandas", label: "pandas / NumPy", tier: 1, branch: "data", note: { en: "19 student features: missing values, encoding, scaling.", zh: "19 个学生特征：缺失值、编码、标准化。" } },
  { id: "sklearn", label: "scikit-learn", tier: 2, branch: "data", note: { en: "Logistic Regression was mine; compared against Decision Tree and KNN.", zh: "逻辑回归是我负责的，和决策树、KNN 对比。" } },
  { id: "matplotlib", label: "Matplotlib", tier: 1, branch: "data", note: { en: "Confusion matrices and metric comparisons.", zh: "混淆矩阵和各项指标对比。" } },
  { id: "pygame", label: "pygame", tier: 0, branch: "data", note: { en: "A tower defence with wave, economy and tower managers. Games teach game loops.", zh: "一个塔防：波次、经济、防御塔各有 manager。做游戏才懂游戏循环。" } },

  { id: "figma", label: "Figma", tier: 0, branch: "craft", note: { en: "Screens get laid out and argued with before I write a line of them.", zh: "界面先摆出来、先跟自己吵一架，再动手写。" } },
  { id: "git", label: "Git", tier: 0, branch: "craft", note: { en: "Branches, rebases, and the occasional force-push regret.", zh: "分支、rebase，以及偶尔 force push 之后的后悔。" } },
  { id: "actions", label: "GitHub Actions", tier: 1, branch: "craft", note: { en: "This site builds and deploys itself on every push to main.", zh: "这个网站每次推到 main 都会自己构建、自己部署。" } },
  { id: "gradle", label: "Gradle", tier: 1, branch: "craft", note: { en: "Two independent builds in Dividend Stream, plus a jpackage MSI installer.", zh: "Dividend Stream 里两套独立构建，外加 jpackage 打的 MSI 安装包。" } },
  { id: "oop", label: "OOP", tier: 0, branch: "craft", note: { en: "Not just inheritance — abstract types, encapsulation, and where the boundaries go.", zh: "不只是继承 —— 抽象类型、封装，以及边界该画在哪。" } },
  { id: "testing", label: "Unit testing", tier: 1, branch: "craft", note: { en: "Firestore rules tested by assertion; Gradle test tasks on both Dividend modules.", zh: "Firestore 规则用断言测；Dividend 两个模块都有 Gradle 测试任务。" } },
  { id: "money", label: "Decimal money", tier: 2, branch: "craft", note: { en: "Integer cents in SavvyPiggy, BigDecimal in Dividend Stream. Never a float.", zh: "SavvyPiggy 用整数分，Dividend Stream 用 BigDecimal。绝不用浮点。" } },
];

export const branchMeta: Record<SkillNode["branch"], { label: L; color: string }> = {
  lang: { label: { en: "Languages", zh: "编程语言" }, color: "var(--color-acid)" },
  web: { label: { en: "Web", zh: "Web" }, color: "var(--color-violet)" },
  mobile: { label: { en: "Mobile", zh: "移动端" }, color: "var(--color-amber)" },
  backend: { label: { en: "Backend", zh: "后端" }, color: "oklch(0.75 0.14 220)" },
  data: { label: { en: "Data & AI", zh: "数据与 AI" }, color: "oklch(0.78 0.12 20)" },
  craft: { label: { en: "Craft", zh: "工程基本功" }, color: "oklch(0.80 0.10 150)" },
};

export type ProjectStatus = "shipped" | "coursework" | "wip" | "prototype";

export type Project = {
  id: string;
  name: string;
  year: string;
  rank: L;
  status: ProjectStatus;
  difficulty: 1 | 2 | 3;
  summary: L;
  bullets: L[];
  stack: string[];
  href?: string;
};

export const statusLabel: Record<ProjectStatus, L> = {
  shipped: { en: "Working build", zh: "已能跑" },
  coursework: { en: "Coursework · submitted", zh: "课程作业 · 已交付" },
  wip: { en: "In progress", zh: "开发中" },
  prototype: { en: "Prototype", zh: "原型阶段" },
};

export const projects: Project[] = [
  {
    id: "savvypiggy",
    name: "SavvyPiggy",
    year: "2026",
    rank: { en: "Main Quest", zh: "主线项目" },
    status: "shipped",
    difficulty: 3,
    summary: {
      en: "A savings app built around piggy banks and honest debt — a deposit clears what you owe before any of it counts toward a goal.",
      zh: "以「存钱罐」为核心的储蓄应用 —— 存进去的钱要先还清欠款，剩下的才算进目标。",
    },
    bullets: [
      {
        en: "Savings split across multiple piggy banks, each with its own goal and progress.",
        zh: "存款拆成多个存钱罐，每个有独立的目标和进度。",
      },
      {
        en: "Borrowing is first-class data: every deposit settles outstanding debt first, so the headline number never lies to you.",
        zh: "借款是一等数据：每笔存入先抵扣欠款，所以首页那个数字不会骗自己。",
      },
      {
        en: "History, strategy and report views all read the same model — one source of truth, three lenses.",
        zh: "历史、策略、报表三个视图共用同一份数据模型 —— 一份真相，三种看法。",
      },
      {
        en: "Money is integer cents everywhere — no floats, so a deposit split across banks never loses a sen.",
        zh: "金额一律用整数「分」存 —— 不碰浮点，所以一笔存款拆进多个罐子也不会少掉一分钱。",
      },
      {
        en: "React 19 + Vite, wrapped by Capacitor into a real APK; Firebase Auth and Firestore behind it, with the security rules covered by assertion tests.",
        zh: "React 19 + Vite，用 Capacitor 打成真正的 APK；后面是 Firebase Auth 和 Firestore，安全规则有断言测试覆盖。",
      },
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind", "Capacitor", "Firebase"],
    href: "https://github.com/JTing904/SavvyPiggy",
  },
  {
    id: "pethub",
    name: "PetHub",
    year: "2025",
    rank: { en: "Diploma mini project", zh: "文凭课程项目" },
    status: "coursework",
    difficulty: 2,
    summary: {
      en: "A pet-care booking app: browse services, open one, fill the form, confirm.",
      zh: "宠物服务预约 App：浏览服务 → 打开详情 → 填表 → 确认预约。",
    },
    bullets: [
      {
        en: "Built with Jetpack Compose and Material 3 — declarative UI, no XML layouts.",
        zh: "用 Jetpack Compose + Material 3 写 —— 声明式 UI，没有一个 XML 布局。",
      },
      {
        en: "Three destinations wired with Navigation Compose: service list, service detail, booking form.",
        zh: "Navigation Compose 串起三个页面：服务列表、服务详情、预约表单。",
      },
      {
        en: "Booking form holds its state with remember/mutableStateOf and only enables Confirm once every field is filled.",
        zh: "预约表单用 remember/mutableStateOf 持有状态，三个字段都填了才允许点「确认」。",
      },
      {
        en: "Services come from an in-memory data object — the point of the exercise was the UI and navigation layer, not persistence.",
        zh: "服务数据来自内存里的一个 data object —— 这个作业练的是 UI 和导航层，不是持久化。",
      },
    ],
    stack: ["Kotlin", "Jetpack Compose", "Material 3", "Navigation"],
  },
  {
    id: "dividend",
    name: "Dividend Stream",
    year: "2026",
    rank: { en: "Side Quest", zh: "支线项目" },
    status: "shipped",
    difficulty: 3,
    summary: {
      en: "A dividend tracker that counts your income upward in real time — per second, per day, per year.",
      zh: "把股息收入实时数上去的追踪器 —— 每秒、每天、每年三个尺度同时在跳。",
    },
    bullets: [
      {
        en: "A live counter: today's accumulated inflow ticks up every second, broken down into per-hour, per-day and next-30-days tiles.",
        zh: "实时计数器：今天累积的收入每秒往上跳，再拆成每小时、每天、未来 30 天三个维度。",
      },
      {
        en: "Dividend calendar: the next payment, a countdown to it, and which holding it comes from — with a bar showing how far the accumulation has crept toward the expected amount.",
        zh: "股息日历：下一笔什么时候到、还剩多久、来自哪只持仓，配一条进度条显示已累积到期望值的多少。",
      },
      {
        en: "Portfolio view: market value against cost basis, per-holding yield and next payment date.",
        zh: "持仓视图：市值对比成本、每只的收益率和下次派息日。",
      },
      {
        en: "Nothing is written per second. Each row stores a rate and a window, and every observer recomputes accrued = elapsed × rate — so a refresh costs one indexed SELECT, and the number never jumps.",
        zh: "没有任何东西是每秒写库的。每一行只存一个速率和一个区间，谁要看谁自己算 accrued = 已过秒数 × 速率 —— 刷新只是一次带索引的 SELECT，数字也不会跳。",
      },
      {
        en: "Kotlin on both ends: a Spring Boot API over PostgreSQL with Flyway migrations and JWT auth, and a Jetpack Compose client in MVVM. Money is BigDecimal throughout and crosses the wire as strings.",
        zh: "两端都是 Kotlin：Spring Boot + PostgreSQL + Flyway 迁移 + JWT 认证的后端，和一个 MVVM 的 Jetpack Compose 客户端。金额全程 BigDecimal，过网络时用字符串传。",
      },
      {
        en: "The same codebase also ships as a Windows desktop app — Compose UI, the API and the database in one process, packaged as an MSI with a bundled Java runtime.",
        zh: "同一套代码还能打成 Windows 桌面应用 —— Compose 界面、API、数据库全在一个进程里，打包成自带 Java 运行时的 MSI 安装包。",
      },
    ],
    stack: ["Kotlin", "Spring Boot", "PostgreSQL", "Flyway", "Jetpack Compose", "Compose Desktop"],
    href: "https://github.com/JTing904/Dividend-Stream",
  },
];

export type TimelineItem = {
  period: string;
  title: L;
  org: L;
  kind: "edu" | "work" | "cca";
  bullets: L[];
};

export const timeline: TimelineItem[] = [
  {
    period: "2026 — present",
    kind: "edu",
    title: { en: "Bachelor of Software Engineering (Honours)", zh: "软件工程荣誉学士" },
    org: { en: "TAR UMT, Kuala Lumpur", zh: "拉曼理工大学，吉隆坡" },
    bullets: [
      { en: "Coursework in software design, object-oriented development and software testing.", zh: "课程涵盖软件设计、面向对象开发与软件测试。" },
    ],
  },
  {
    period: "2026 Jan — 2026 May",
    kind: "work",
    title: { en: "System Support Technician", zh: "系统支持技术员" },
    org: { en: "MEVO Sdn Bhd", zh: "MEVO Sdn Bhd" },
    bullets: [
      { en: "Provided first-line support and resolved hardware and software issues.", zh: "提供一线技术支持，处理软硬件故障。" },
      { en: "Set up user accounts and maintained accurate case logs.", zh: "开设用户账号，维护准确的工单记录。" },
    ],
  },
  {
    period: "2024 — 2026",
    kind: "edu",
    title: { en: "Diploma in Computer Science · CGPA 3.2", zh: "计算机科学文凭 · CGPA 3.2" },
    org: { en: "TAR UMT, Kuala Lumpur", zh: "拉曼理工大学，吉隆坡" },
    bullets: [
      { en: "Object-oriented programming, data structures and algorithms, database systems, web application development.", zh: "面向对象编程、数据结构与算法、数据库系统、Web 应用开发。" },
    ],
  },
  {
    period: "2024 — 2026",
    kind: "cca",
    title: { en: "Member, Computer Science Society", zh: "计算机科学学会 会员" },
    org: { en: "TAR UMT", zh: "拉曼理工大学" },
    bullets: [
      { en: "Helped the committee plan and run technical workshops and society events.", zh: "协助委员会策划并执行技术工作坊与学会活动。" },
      { en: "Handled participant registration and on-the-day coordination.", zh: "负责参与者报名与当天现场协调。" },
    ],
  },
  {
    period: "2023 Mar — 2023 Jun",
    kind: "work",
    title: { en: "Cashier", zh: "收银员" },
    org: { en: "Zemart Supermarket", zh: "Zemart 超市" },
    bullets: [
      { en: "Handled cash and card payments, balanced the till, maintained stock displays.", zh: "处理现金与刷卡付款，核对账目，维护货架陈列。" },
    ],
  },
];

export const ui = {
  nav: {
    about: { en: "About", zh: "关于" },
    skills: { en: "Skills", zh: "技能" },
    projects: { en: "Projects", zh: "项目" },
    journey: { en: "Journey", zh: "经历" },
    github: { en: "GitHub", zh: "GitHub" },
    code: { en: "Code", zh: "跑代码" },
    play: { en: "Play", zh: "玩一下" },
    contact: { en: "Contact", zh: "联系" },
  },
  playMode: { en: "Play", zh: "游玩" },
  recruiterMode: { en: "Recruiter", zh: "简历" },
  modeHint: {
    en: "Switch to a plain, scannable résumé",
    zh: "切换成干净好读的简历版",
  },
  playHint: {
    en: "Switch back to the interactive version",
    zh: "切回可交互版本",
  },
  achievements: { en: "Achievements", zh: "成就" },
  unlocked: { en: "Achievement unlocked", zh: "成就解锁" },
  sectionAbout: { en: "Character", zh: "角色卡" },
  sectionSkills: { en: "Skill Tree", zh: "技能树" },
  sectionProjects: { en: "Quest Log", zh: "任务日志" },
  sectionJourney: { en: "Journey", zh: "旅程" },
  sectionGithub: { en: "Live from GitHub", zh: "GitHub 实时数据" },
  sectionPlayground: { en: "Run My Code", zh: "跑一下我的代码" },
  sectionPlay: { en: "Deploy Run", zh: "上线冲刺" },
  sectionContact: { en: "Contact", zh: "联系方式" },
  selfRated: { en: "self-rated", zh: "自评" },
  clickNode: { en: "Tap a node for detail", zh: "点节点看详情" },
  scrollHint: { en: "scroll", zh: "向下滚" },
} satisfies Record<string, L | Record<string, L>>;
