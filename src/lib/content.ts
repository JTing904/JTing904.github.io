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
    en: "I ship mobile and web apps — and I'm heading for backend.",
    zh: "写移动端和 Web 应用，正在往后端走。",
  } satisfies L,
  about: {
    en: "Computer Science diploma holder now reading for a Bachelor of Software Engineering at TAR UMT. I build mobile and web applications in Kotlin, Java and Python, apply object-oriented principles in practice, and I like learning new frameworks and testing methods faster than the syllabus asks me to.",
    zh: "计算机科学文凭毕业，现在在 TAR UMT 读软件工程荣誉学士。用 Kotlin、Java 和 Python 写移动端和 Web 应用，把面向对象真的用在项目里，喜欢比课纲更快地去啃新框架和测试方法。",
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
  { key: { en: "Backend", zh: "后端" }, value: 58 },
  { key: { en: "Web", zh: "Web 前端" }, value: 62 },
  { key: { en: "Data Structures", zh: "数据结构" }, value: 70 },
  { key: { en: "Databases", zh: "数据库" }, value: 66 },
];

export type SkillNode = {
  id: string;
  label: string;
  tier: number;
  branch: "lang" | "web" | "mobile" | "tools" | "concept";
  note: L;
};

export const skills: SkillNode[] = [
  { id: "java", label: "Java", tier: 0, branch: "lang", note: { en: "First language. OOP, collections, JavaFX coursework.", zh: "入门语言。面向对象、集合框架、JavaFX 课程作业。" } },
  { id: "kotlin", label: "Kotlin", tier: 1, branch: "lang", note: { en: "Main language for Android. Coroutines, null safety.", zh: "Android 主力语言。协程、空安全。" } },
  { id: "python", label: "Python", tier: 1, branch: "lang", note: { en: "Scripting, coursework, quick data work.", zh: "脚本、课程作业、快速处理数据。" } },
  { id: "cpp", label: "C++", tier: 0, branch: "lang", note: { en: "Data structures and algorithms coursework.", zh: "数据结构与算法课程。" } },
  { id: "ts", label: "TypeScript", tier: 2, branch: "lang", note: { en: "SavvyPiggy is written in it. Types over guesswork.", zh: "SavvyPiggy 就是用它写的。有类型胜过猜。" } },

  { id: "html", label: "HTML", tier: 0, branch: "web", note: { en: "Semantics first, then styling.", zh: "先把语义写对，再谈样式。" } },
  { id: "css", label: "CSS", tier: 1, branch: "web", note: { en: "Modern layout, custom properties, scroll-driven animation.", zh: "现代布局、CSS 变量、滚动驱动动画。" } },
  { id: "js", label: "JavaScript", tier: 1, branch: "web", note: { en: "DOM, async, the browser as a runtime.", zh: "DOM、异步、把浏览器当运行时用。" } },
  { id: "react", label: "React", tier: 2, branch: "web", note: { en: "This site — React 19 on Next.js.", zh: "这个网站本身 —— Next.js 上的 React 19。" } },

  { id: "android", label: "Android", tier: 1, branch: "mobile", note: { en: "Activities, fragments, room, the full build cycle.", zh: "Activity、Fragment、Room，完整构建流程。" } },
  { id: "jetpack", label: "Jetpack", tier: 2, branch: "mobile", note: { en: "Navigation, ViewModel, lifecycle-aware components.", zh: "Navigation、ViewModel、生命周期感知组件。" } },

  { id: "git", label: "Git", tier: 0, branch: "tools", note: { en: "Branches, rebases, and the occasional force-push regret.", zh: "分支、rebase，以及偶尔 force push 之后的后悔。" } },
  { id: "figma", label: "Figma", tier: 1, branch: "tools", note: { en: "Prototyped PetHub's whole flow before writing code.", zh: "PetHub 整个流程先在 Figma 走通再写代码。" } },
  { id: "vscode", label: "VS Code", tier: 0, branch: "tools", note: { en: "Daily driver.", zh: "日常主力编辑器。" } },

  { id: "oop", label: "OOP", tier: 1, branch: "concept", note: { en: "Not just inheritance — composition, interfaces, boundaries.", zh: "不只是继承 —— 组合、接口、边界划分。" } },
  { id: "dsa", label: "DSA", tier: 1, branch: "concept", note: { en: "Trees, graphs, complexity analysis.", zh: "树、图、复杂度分析。" } },
  { id: "db", label: "Databases", tier: 2, branch: "concept", note: { en: "Schema design, normalisation, SQL.", zh: "表结构设计、范式、SQL。" } },
  { id: "testing", label: "Testing", tier: 2, branch: "concept", note: { en: "Module-level tests before every release.", zh: "每次发布前先做模块级测试。" } },
];

export const branchMeta: Record<SkillNode["branch"], { label: L; color: string }> = {
  lang: { label: { en: "Languages", zh: "编程语言" }, color: "var(--color-acid)" },
  web: { label: { en: "Web", zh: "Web" }, color: "var(--color-violet)" },
  mobile: { label: { en: "Mobile", zh: "移动端" }, color: "var(--color-amber)" },
  tools: { label: { en: "Tools", zh: "工具" }, color: "oklch(0.75 0.14 220)" },
  concept: { label: { en: "Fundamentals", zh: "基础" }, color: "oklch(0.78 0.12 20)" },
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
        en: "Written in TypeScript end to end. MIT licensed and open on GitHub.",
        zh: "全程 TypeScript 带类型写。MIT 协议，GitHub 上开源。",
      },
    ],
    stack: ["TypeScript", "Android"],
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
        en: "Kotlin Android client. Figures are cached locally so the app opens instantly and refreshes in the background rather than blocking on the network.",
        zh: "Kotlin Android 客户端。数据本地缓存，打开就有内容，联网刷新放到后台，不卡在网络请求上。",
      },
    ],
    stack: ["Kotlin", "Android"],
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
