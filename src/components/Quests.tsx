"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, statusLabel, ui } from "@/lib/content";
import { allShots, artAccent, projectArt, projectScreens, screenSrc } from "@/lib/art";
import { useStore } from "@/lib/store";
import Section from "./Section";
import PhoneShowcase from "./PhoneShowcase";

const ART: Record<string, string> = {
  pethub: "pethub",
  savvypiggy: "savvypiggy",
  dividend: "dividend",
};

export default function Quests() {
  const { t, lang, unlock } = useStore();
  const [open, setOpen] = useState<string | null>(projects[0].id);
  const [active, setActive] = useState(projects[0].id);
  const [tab, setTab] = useState(0);
  const [part, setPart] = useState(0);

  const artKey = ART[active] ?? "pethub";
  const screens = projectScreens[artKey] ?? [];
  const parts = screens[tab]?.parts ?? [];
  const en = lang === "en";

  return (
    <Section id="projects" index="03" title={ui.sectionProjects}>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="grid gap-4">
          {projects.map((p) => {
            const expanded = open === p.id;
            const accent = artAccent[ART[p.id]] ?? "var(--color-acid)";
            return (
              <li
                key={p.id}
                data-spotlight
                onMouseEnter={() => {
                  setActive(p.id);
                  setTab(0);
                  setPart(0);
                }}
                className={`gradient-border reveal overflow-hidden rounded-2xl border bg-bg-2/70 transition-colors ${
                  expanded ? "border-transparent" : "border-line"
                }`}
                style={expanded ? { borderColor: `color-mix(in oklch, ${accent} 45%, transparent)` } : undefined}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => {
                    setOpen(expanded ? null : p.id);
                    setActive(p.id);
                    setTab(0);
                    setPart(0);
                    unlock("questlog");
                  }}
                  className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
                >
                  <span
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg font-mono text-sm transition-colors"
                    style={
                      expanded
                        ? { background: accent, color: "#0b0d14" }
                        : { background: "var(--color-surface)", color: "var(--color-muted)" }
                    }
                  >
                    {expanded ? "−" : "+"}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className="text-lg font-semibold tracking-tight">{p.name}</span>
                      <span
                        className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                        style={{ borderColor: `color-mix(in oklch, ${accent} 55%, transparent)`, color: accent }}
                      >
                        {t(p.rank)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          p.status === "shipped"
                            ? "bg-acid/15 text-acid"
                            : p.status === "coursework"
                              ? "bg-violet/15 text-violet"
                              : p.status === "wip"
                                ? "bg-amber/15 text-amber"
                                : "bg-surface text-muted"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {t(statusLabel[p.status])}
                      </span>
                      <span className="font-mono text-[11px] text-muted">{p.year}</span>
                      <span
                        className="ml-auto font-mono text-[11px]"
                        style={{ color: accent }}
                        title={lang === "en" ? "Difficulty" : "难度"}
                      >
                        {"★".repeat(p.difficulty)}
                        <span className="text-line">{"★".repeat(3 - p.difficulty)}</span>
                      </span>
                    </span>
                    <span className="mt-2 block text-pretty text-sm text-muted">
                      {t(p.summary)}
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-line/60 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                        {/* flat art on small screens, where the 3D column is hidden */}
                        <div className="mb-5 flex justify-center lg:hidden" aria-hidden>
                          {screenSrc(ART[p.id]) ? (
                            <span className="thin-scroll flex gap-3 overflow-x-auto pb-2">
                              {allShots(ART[p.id]).map((src) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={src}
                                  src={src}
                                  alt=""
                                  className="h-[320px] w-auto shrink-0 rounded-2xl border border-line"
                                />
                              ))}
                            </span>
                          ) : (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (projectArt[ART[p.id]] ?? "").replace(
                                  "<svg ",
                                  '<svg class="h-[320px] w-auto rounded-2xl border border-line" ',
                                ),
                              }}
                            />
                          )}
                        </div>

                        <ul className="grid gap-2">
                          {p.bullets.map((b) => (
                            <li key={b.en} className="flex gap-2.5 text-sm text-fg/85">
                              <span
                                className="mt-[7px] size-1.5 shrink-0 rounded-full"
                                style={{ background: accent }}
                              />
                              <span className="text-pretty">{t(b)}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {p.stack.map((s) => (
                            <span
                              key={s}
                              className="rounded border border-line bg-surface/60 px-2 py-0.5 font-mono text-[11px] text-muted"
                            >
                              {s}
                            </span>
                          ))}
                          {p.href && (
                            <a
                              href={p.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-magnetic
                              className="ml-auto rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors"
                              style={{ borderColor: `color-mix(in oklch, ${accent} 55%, transparent)`, color: accent }}
                            >
                              {lang === "en" ? "View on GitHub →" : "去 GitHub 看 →"}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="reveal hidden lg:block">
          <div className="sticky top-24">
            <div className="h-[540px]">
              <PhoneShowcase artKey={artKey} tab={tab} part={part} />
            </div>

            {screens.length > 1 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {screens.map((s, i) => (
                  <button
                    key={s.tab}
                    type="button"
                    onClick={() => {
                      setTab(i);
                      setPart(0);
                    }}
                    className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                      tab === i
                        ? "border-acid bg-acid/15 text-acid"
                        : "border-line text-muted hover:text-fg"
                    }`}
                  >
                    {s.tab}
                  </button>
                ))}
              </div>
            )}

            {parts.length > 1 && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="font-mono text-[10px] text-muted/70">
                  {en ? "scroll" : "下滑"}
                </span>
                {parts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${en ? "Scroll position" : "滚动位置"} ${i + 1}`}
                    onClick={() => setPart(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      part === i ? "w-6 bg-acid" : "w-1.5 bg-line hover:bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
