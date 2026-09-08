"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile, projects, type L } from "@/lib/content";
import { useStore } from "@/lib/store";

type Item = {
  id: string;
  label: L;
  hint: L;
  group: L;
  icon: string;
  run: () => void;
};

/** Subsequence match with a bonus for consecutive hits and word starts. */
function score(query: string, text: string) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let ti = 0;
  let s = 0;
  let streak = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    streak = found === ti ? streak + 1 : 0;
    s += 1 + streak * 2 + (found === 0 || t[found - 1] === " " ? 3 : 0);
    ti = found + 1;
  }
  return s / (1 + t.length * 0.02);
}

export default function CommandPalette() {
  const { lang, setLang, mode, setMode, t, unlock } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const go = useCallback((id: string) => {
    setOpen(false);
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, []);

  const items = useMemo<Item[]>(() => {
    const nav: [string, L, string][] = [
      ["about", { en: "About", zh: "关于我" }, "◆"],
      ["skills", { en: "Skill tree", zh: "技能树" }, "✦"],
      ["projects", { en: "Projects", zh: "项目" }, "◈"],
      ["journey", { en: "Journey", zh: "经历" }, "▸"],
      ["github", { en: "GitHub activity", zh: "GitHub 活动" }, "◐"],
      ["code", { en: "Run my code", zh: "跑我的代码" }, "{}"],
      ["play", { en: "Play Deploy Run", zh: "玩上线冲刺" }, "▶"],
      ["contact", { en: "Contact", zh: "联系方式" }, "✉"],
    ];

    const jump: L = { en: "Jump to", zh: "跳转" };
    const act: L = { en: "Action", zh: "操作" };
    const proj: L = { en: "Open repo", zh: "打开仓库" };

    const list: Item[] = nav.map(([id, label, icon]) => ({
      id: `nav:${id}`,
      label,
      hint: { en: `#${id}`, zh: `#${id}` },
      group: jump,
      icon,
      run: () => go(id),
    }));

    list.push(
      {
        id: "act:lang",
        label:
          lang === "en"
            ? { en: "Switch to 中文", zh: "切换到中文" }
            : { en: "Switch to English", zh: "切换成英文" },
        hint: { en: "language", zh: "语言" },
        group: act,
        icon: "文",
        run: () => {
          setLang(lang === "en" ? "zh" : "en");
          setOpen(false);
        },
      },
      {
        id: "act:mode",
        label:
          mode === "play"
            ? { en: "Open recruiter mode", zh: "打开简历模式" }
            : { en: "Back to play mode", zh: "回到游玩模式" },
        hint: { en: "view", zh: "视图" },
        group: act,
        icon: "▤",
        run: () => {
          setMode(mode === "play" ? "recruiter" : "play");
          setOpen(false);
        },
      },
      {
        id: "act:print",
        label: { en: "Print / save as PDF", zh: "打印 / 存成 PDF" },
        hint: { en: "résumé", zh: "简历" },
        group: act,
        icon: "⎙",
        run: () => {
          setMode("recruiter");
          setOpen(false);
          setTimeout(() => window.print(), 600);
        },
      },
      {
        id: "act:email",
        label: { en: "Email me", zh: "给我发邮件" },
        hint: { en: profile.email, zh: profile.email },
        group: act,
        icon: "✉",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
          setOpen(false);
        },
      },
      {
        id: "act:github",
        label: { en: "Open GitHub profile", zh: "打开 GitHub 主页" },
        hint: { en: "@JTing904", zh: "@JTing904" },
        group: act,
        icon: "◐",
        run: () => {
          window.open(profile.github, "_blank", "noopener,noreferrer");
          setOpen(false);
        },
      },
    );

    for (const p of projects) {
      if (!p.href) continue;
      list.push({
        id: `repo:${p.id}`,
        label: { en: p.name, zh: p.name },
        hint: p.summary,
        group: proj,
        icon: "⌥",
        run: () => {
          window.open(p.href, "_blank", "noopener,noreferrer");
          setOpen(false);
        },
      });
    }

    return list;
  }, [go, lang, mode, setLang, setMode]);

  const results = useMemo(() => {
    const scored = items
      .map((it) => ({ it, s: Math.max(score(q, it.label[lang]), score(q, it.hint[lang]) * 0.6) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s);
    return scored.map((r) => r.it);
  }, [items, q, lang]);

  useEffect(() => setI(0), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) unlock("seeker");
          return !o;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => {
      setOpen(true);
      unlock("seeker");
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [unlock]);

  useEffect(() => {
    if (open) {
      setQ("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [i]);

  const en = lang === "en";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="no-print fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="absolute inset-0 bg-bg/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: -12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -8, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 460, damping: 34 }}
              className="glass relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-line/70 px-4">
                <span className="font-mono text-sm text-acid">⌘</span>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setI((v) => Math.min(results.length - 1, v + 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setI((v) => Math.max(0, v - 1));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      results[i]?.run();
                    }
                  }}
                  placeholder={en ? "Type a command or search…" : "输入命令或搜索…"}
                  className="w-full bg-transparent py-3.5 font-mono text-sm outline-none placeholder:text-muted/60"
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  esc
                </kbd>
              </div>

              <ul ref={listRef} className="thin-scroll max-h-[46vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center font-mono text-xs text-muted">
                    {en ? "no matches" : "没有匹配项"}
                  </li>
                )}
                {results.map((it, idx) => {
                  const prev = results[idx - 1];
                  const newGroup = !prev || prev.group.en !== it.group.en;
                  return (
                    <li key={it.id}>
                      {newGroup && (
                        <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
                          {t(it.group)}
                        </p>
                      )}
                      <button
                        type="button"
                        data-active={idx === i}
                        onMouseEnter={() => setI(idx)}
                        onClick={() => it.run()}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          idx === i ? "bg-acid/12 text-fg" : "text-fg/80 hover:bg-surface/70"
                        }`}
                      >
                        <span
                          className={`grid size-6 shrink-0 place-items-center rounded font-mono text-[11px] ${
                            idx === i ? "bg-acid text-bg" : "bg-surface text-muted"
                          }`}
                        >
                          {it.icon}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">{t(it.label)}</span>
                        <span className="shrink-0 truncate font-mono text-[10px] text-muted">
                          {t(it.hint).slice(0, 28)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-4 border-t border-line/70 px-4 py-2 font-mono text-[10px] text-muted">
                <span>↑↓ {en ? "navigate" : "移动"}</span>
                <span>↵ {en ? "select" : "选择"}</span>
                <span className="ml-auto">{results.length} {en ? "results" : "项"}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
