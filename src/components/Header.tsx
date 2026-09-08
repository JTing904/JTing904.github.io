"use client";

import { useState } from "react";
import { profile, ui } from "@/lib/content";
import { ACHIEVEMENTS, ACHIEVEMENT_IDS, useStore } from "@/lib/store";

const NAV = [
  { id: "about", label: ui.nav.about },
  { id: "skills", label: ui.nav.skills },
  { id: "projects", label: ui.nav.projects },
  { id: "journey", label: ui.nav.journey },
  { id: "play", label: ui.nav.play },
  { id: "contact", label: ui.nav.contact },
];

export default function Header() {
  const { t, lang, setLang, mode, setMode, unlocked } = useStore();
  const [panel, setPanel] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a
          href="#top"
          className="font-mono text-sm font-semibold tracking-tight text-fg shrink-0"
        >
          <span className="text-acid">&gt;_</span> {profile.handle}
        </a>

        {mode === "play" && (
          <nav className="ml-2 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-md px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-surface hover:text-fg"
              >
                {t(n.label)}
              </a>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {mode === "play" && (
            <button
              type="button"
              onClick={() => setPanel((p) => !p)}
              aria-expanded={panel}
              className="rounded-md border border-line px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-amber/60 hover:text-amber"
              title={t(ui.achievements)}
            >
              ★ {unlocked.size}
              <span className="text-line">/</span>
              {ACHIEVEMENT_IDS.length}
            </button>
          )}

          <div className="flex overflow-hidden rounded-md border border-line font-mono text-xs">
            {(["en", "zh"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === l ? "bg-acid text-bg font-semibold" : "text-muted hover:text-fg"
                }`}
              >
                {l === "en" ? "EN" : "中"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMode(mode === "play" ? "recruiter" : "play")}
            title={t(mode === "play" ? ui.modeHint : ui.playHint)}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-acid/70 hover:text-acid"
          >
            {mode === "play" ? `▤ ${t(ui.recruiterMode)}` : `▶ ${t(ui.playMode)}`}
          </button>
        </div>
      </div>

      <div className="h-px w-full origin-left scale-x-0 bg-gradient-to-r from-acid via-violet to-transparent scroll-progress" />

      {panel && (
        <div className="absolute right-4 top-16 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-line bg-bg-2 p-3 shadow-2xl sm:right-6">
          <p className="mb-2 px-1 font-mono text-[11px] uppercase tracking-widest text-muted">
            {t(ui.achievements)} · {unlocked.size}/{ACHIEVEMENT_IDS.length}
          </p>
          <ul className="grid gap-1">
            {ACHIEVEMENT_IDS.map((id) => {
              const a = ACHIEVEMENTS[id];
              const got = unlocked.has(id);
              return (
                <li
                  key={id}
                  className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 ${
                    got ? "bg-surface/70" : "opacity-45"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded font-mono text-xs ${
                      got ? "bg-amber/20 text-amber" : "bg-surface text-muted"
                    }`}
                  >
                    {got ? a.icon : "?"}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium">{t(a.title)}</span>
                    <span className="block font-mono text-[11px] text-muted">
                      {got ? t(a.desc) : "— — —"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
