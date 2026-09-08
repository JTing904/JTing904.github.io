"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { profile, ui, type L } from "@/lib/content";
import { useStore } from "@/lib/store";

type Line = { id: number; text: string; tone?: "muted" | "acid" | "violet" | "danger" };

const BOOT: L[] = [
  { en: "$ whoami", zh: "$ whoami" },
  { en: "tan_keng_ting — software engineering undergraduate", zh: "tan_keng_ting — 软件工程在读本科生" },
  { en: "$ locate ./strengths", zh: "$ locate ./strengths" },
  { en: "kotlin · typescript · python · java · android", zh: "kotlin · typescript · python · java · android" },
  { en: "$ cat ./goal", zh: "$ cat ./goal" },
];

let seq = 0;
const line = (text: string, tone?: Line["tone"]): Line => ({ id: ++seq, text, tone });

export default function Terminal() {
  const { t, lang, setLang, setMode, unlock } = useStore();
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence types itself out on first load; a later language switch
  // just re-renders the same lines instantly rather than replaying the show.
  const hasBooted = useRef(false);
  useEffect(() => {
    if (hasBooted.current) {
      setLines(BOOT.map((l) => line(l[lang], l[lang].startsWith("$") ? "acid" : "muted")));
      return;
    }
    setLines([]);
    const timers: number[] = [];
    BOOT.forEach((l, i) => {
      timers.push(
        window.setTimeout(() => {
          setLines((prev) => [
            ...prev,
            line(l[lang], l[lang].startsWith("$") ? "acid" : "muted"),
          ]);
          if (i === BOOT.length - 1) {
            hasBooted.current = true;
            setBooted(true);
          }
        }, 240 + i * 260),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [lang]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const go = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const push = useCallback((text: string, tone?: Line["tone"]) => {
    setLines((prev) => [...prev.slice(-40), line(text, tone)]);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      push(`$ ${raw.trim()}`, "acid");
      setHistory((h) => [...h, raw.trim()]);
      setHistIdx(-1);
      unlock("commander");

      const say = (en: string, zh: string, tone?: Line["tone"]) =>
        push(lang === "en" ? en : zh, tone);

      switch (cmd) {
        case "help":
        case "?":
          say(
            "about · skills · projects · journey · play · contact · lang · mode · github · clear",
            "about · skills · projects · journey · play · contact · lang · mode · github · clear",
            "muted",
          );
          break;
        case "about":
        case "skills":
        case "projects":
        case "journey":
        case "play":
        case "contact":
          say(`opening #${cmd} …`, `正在打开 #${cmd} …`, "muted");
          go(cmd);
          break;
        case "whoami":
          say(
            `${profile.name} (${profile.handle}) — ${profile.role.en}`,
            `${profile.name}（${profile.handle}）— ${profile.role.zh}`,
            "muted",
          );
          break;
        case "ls":
          say(
            "about/  skills/  projects/  journey/  play/  contact/",
            "about/  skills/  projects/  journey/  play/  contact/",
            "muted",
          );
          break;
        case "lang":
          setLang(lang === "en" ? "zh" : "en");
          break;
        case "mode":
          setMode("recruiter");
          break;
        case "github":
          say("opening github.com/JTing904 …", "正在打开 github.com/JTing904 …", "muted");
          window.open(profile.github, "_blank", "noopener,noreferrer");
          break;
        case "clear":
          setLines([]);
          break;
        case "sudo":
        case "sudo su":
          say(
            "nice try. this account has no sudoers entry.",
            "想得美，这个账号不在 sudoers 名单里。",
            "danger",
          );
          break;
        case "secret":
          say("↑ ↑ ↓ ↓ ← → ← → B A", "↑ ↑ ↓ ↓ ← → ← → B A", "violet");
          break;
        case "hire":
        case "hire me":
          say("that is the idea. scrolling to contact …", "就是这个意思。跳到联系方式 …", "violet");
          go("contact");
          break;
        default:
          say(
            `command not found: ${cmd} — try "help"`,
            `找不到命令：${cmd} —— 试试 "help"`,
            "danger",
          );
      }
    },
    [go, lang, push, setLang, setMode, unlock],
  );

  const CHIPS = ["help", "about", "projects", "play", "contact"];

  return (
    <section
      id="top"
      className="relative scroll-mt-16 overflow-hidden px-4 pt-8 pb-6 sm:px-6 sm:pt-14 sm:pb-10"
    >
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[520px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="scanlines glow-acid relative overflow-hidden rounded-2xl border border-line bg-bg-2/90 backdrop-blur"
        >
          <div className="flex items-center gap-2 border-b border-line/80 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-amber/70" />
            <span className="size-2.5 rounded-full bg-acid/70" />
            <span className="ml-2 font-mono text-[11px] text-muted">
              {profile.handle.toLowerCase()}@portfolio — ~/
            </span>
          </div>

          <div
            ref={bodyRef}
            className="thin-scroll max-h-[38vh] min-h-[9.5rem] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:px-6"
          >
            {lines.map((l) => (
              <p
                key={l.id}
                className={
                  l.tone === "acid"
                    ? "text-acid"
                    : l.tone === "violet"
                      ? "text-violet"
                      : l.tone === "danger"
                        ? "text-danger"
                        : "text-muted"
                }
              >
                {l.text}
              </p>
            ))}
          </div>

          <div className="border-t border-line/80 px-4 py-6 sm:px-6 sm:py-8">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 14 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
            >
              {profile.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: booted ? 1 : 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="mt-2 font-mono text-sm text-acid"
            >
              {t(profile.role)}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: booted ? 1 : 0 }}
              transition={{ delay: 0.24, duration: 0.6 }}
              className="mt-4 max-w-xl text-pretty text-base text-muted sm:text-lg"
            >
              {t(profile.tagline)}
            </motion.p>
          </div>

          <div className="border-t border-line/80 px-4 py-3 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
                setInput("");
              }}
              className="flex items-center gap-2"
            >
              <span className="font-mono text-sm text-acid">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" && history.length) {
                    e.preventDefault();
                    const i = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
                    setHistIdx(i);
                    setInput(history[i]);
                  } else if (e.key === "ArrowDown" && histIdx >= 0) {
                    e.preventDefault();
                    const i = histIdx + 1;
                    if (i >= history.length) {
                      setHistIdx(-1);
                      setInput("");
                    } else {
                      setHistIdx(i);
                      setInput(history[i]);
                    }
                  }
                }}
                spellCheck={false}
                autoComplete="off"
                aria-label={lang === "en" ? "Terminal command" : "终端命令"}
                placeholder={lang === "en" ? 'type "help" and press enter' : '输入 "help" 然后回车'}
                className="w-full bg-transparent font-mono text-sm text-fg placeholder:text-muted/60 focus:outline-none"
              />
            </form>
          </div>
        </motion.div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                run(c);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-line bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-acid/60 hover:text-acid"
            >
              {c}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[11px] text-muted/70 sm:inline">
            {t(ui.clickNode)} · ↑↓ history
          </span>
        </div>
      </div>
    </section>
  );
}
