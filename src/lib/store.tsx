"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { L, Lang } from "./content";

export type Mode = "play" | "recruiter";

export type AchievementId =
  | "boot"
  | "commander"
  | "polyglot"
  | "recruiter"
  | "skiller"
  | "questlog"
  | "runner"
  | "shipped"
  | "konami"
  | "nightowl"
  | "hacker"
  | "seeker";

export const ACHIEVEMENTS: Record<AchievementId, { icon: string; title: L; desc: L }> = {
  boot: {
    icon: "▲",
    title: { en: "Cold Boot", zh: "冷启动" },
    desc: { en: "Loaded the site.", zh: "打开了这个网站。" },
  },
  commander: {
    icon: ">_",
    title: { en: "Commander", zh: "命令行玩家" },
    desc: { en: "Ran a command in the terminal.", zh: "在终端里跑了一条命令。" },
  },
  polyglot: {
    icon: "文",
    title: { en: "Polyglot", zh: "双语切换" },
    desc: { en: "Switched language.", zh: "切换过语言。" },
  },
  recruiter: {
    icon: "▤",
    title: { en: "Straight to Business", zh: "直奔主题" },
    desc: { en: "Opened recruiter mode.", zh: "打开了简历模式。" },
  },
  skiller: {
    icon: "✦",
    title: { en: "Talent Scout", zh: "点技能树" },
    desc: { en: "Inspected a skill node.", zh: "查看了一个技能节点。" },
  },
  questlog: {
    icon: "◈",
    title: { en: "Quest Reader", zh: "任务阅读者" },
    desc: { en: "Expanded a project card.", zh: "展开了一张项目卡。" },
  },
  runner: {
    icon: "▸",
    title: { en: "First Deploy", zh: "首次上线" },
    desc: { en: "Played Deploy Run.", zh: "玩了一次上线冲刺。" },
  },
  shipped: {
    icon: "★",
    title: { en: "Shipped to Production", zh: "推上生产环境" },
    desc: { en: "Scored 100+ in Deploy Run.", zh: "上线冲刺拿到 100 分以上。" },
  },
  konami: {
    icon: "☰",
    title: { en: "Old School", zh: "老玩家" },
    desc: { en: "Entered the Konami code.", zh: "输入了魂斗罗秘技。" },
  },
  nightowl: {
    icon: "☾",
    title: { en: "Night Owl", zh: "夜猫子" },
    desc: { en: "Visited between midnight and 5am.", zh: "在午夜到清晨五点之间来访。" },
  },
  hacker: {
    icon: "{}",
    title: { en: "Ran My Code", zh: "跑过代码" },
    desc: { en: "Executed a snippet in the sandbox.", zh: "在沙箱里跑了一段代码。" },
  },
  seeker: {
    icon: "⌘",
    title: { en: "Power User", zh: "快捷键玩家" },
    desc: { en: "Opened the command palette.", zh: "打开了命令面板。" },
  },
};

export const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENTS) as AchievementId[];

type Toast = { id: number; achievement: AchievementId };

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (v: L) => string;
  mode: Mode;
  setMode: (m: Mode) => void;
  unlocked: Set<AchievementId>;
  unlock: (id: AchievementId) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  konami: boolean;
};

const Ctx = createContext<Store | null>(null);

const LS_ACH = "ejt.achievements";
const LS_LANG = "ejt.lang";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode, blocked storage — feature is optional */
  }
}

/** Wrap a state change in a View Transition when the browser supports it. */
export function withTransition(fn: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (doc.startViewTransition && !reduce) doc.startViewTransition(fn);
  else fn();
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mode, setModeState] = useState<Mode>("play");
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [konami, setKonami] = useState(false);
  const toastSeq = useRef(0);
  const buffer = useRef<string[]>([]);

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      safeSet(LS_ACH, JSON.stringify([...next]));
      const tid = ++toastSeq.current;
      setToasts((ts) => [...ts, { id: tid, achievement: id }]);
      window.setTimeout(() => {
        setToasts((ts) => ts.filter((t) => t.id !== tid));
      }, 4200);
      return next;
    });
  }, []);

  // hydrate from storage, then award the opening achievements
  useEffect(() => {
    const storedLang = safeGet(LS_LANG);
    if (storedLang === "en" || storedLang === "zh") setLangState(storedLang);

    const stored = safeGet(LS_ACH);
    if (stored) {
      try {
        const list = JSON.parse(stored) as AchievementId[];
        setUnlocked(new Set(list.filter((i) => i in ACHIEVEMENTS)));
      } catch {
        /* ignore malformed */
      }
    }

    const t1 = window.setTimeout(() => unlock("boot"), 1400);
    const hour = new Date().getHours();
    const t2 =
      hour < 5 ? window.setTimeout(() => unlock("nightowl"), 2600) : undefined;
    return () => {
      window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, [unlock]);

  // Konami code
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.current = [...buffer.current, key].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => buffer.current[i] === k)) {
        buffer.current = [];
        setKonami(true);
        unlock("konami");
        window.setTimeout(() => setKonami(false), 6000);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.mode = mode;
  }, [lang, mode]);

  const setLang = useCallback(
    (l: Lang) => {
      withTransition(() => setLangState(l));
      safeSet(LS_LANG, l);
      unlock("polyglot");
    },
    [unlock],
  );

  const setMode = useCallback(
    (m: Mode) => {
      withTransition(() => setModeState(m));
      if (m === "recruiter") unlock("recruiter");
    },
    [unlock],
  );

  const t = useCallback((v: L) => v[lang], [lang]);

  const dismissToast = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<Store>(
    () => ({ lang, setLang, t, mode, setMode, unlocked, unlock, toasts, dismissToast, konami }),
    [lang, setLang, t, mode, setMode, unlocked, unlock, toasts, dismissToast, konami],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
