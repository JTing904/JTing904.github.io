"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, ui } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

export default function Quests() {
  const { t, lang, unlock } = useStore();
  const [open, setOpen] = useState<string | null>(projects[0].id);

  return (
    <Section id="projects" index="03" title={ui.sectionProjects}>
      <ul className="grid gap-4">
        {projects.map((p) => {
          const expanded = open === p.id;
          return (
            <li
              key={p.id}
              className={`reveal overflow-hidden rounded-2xl border bg-bg-2/70 transition-colors ${
                expanded ? "border-acid/45" : "border-line hover:border-line/80"
              }`}
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => {
                  setOpen(expanded ? null : p.id);
                  unlock("questlog");
                }}
                className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
              >
                <span
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg font-mono text-sm transition-colors ${
                    expanded ? "bg-acid text-bg" : "bg-surface text-muted"
                  }`}
                >
                  {expanded ? "−" : "+"}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-lg font-semibold tracking-tight">{p.name}</span>
                    <span className="rounded-full border border-violet/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violet">
                      {t(p.rank)}
                    </span>
                    <span className="font-mono text-[11px] text-muted">{p.year}</span>
                    <span
                      className="ml-auto font-mono text-[11px] text-amber"
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
                      <ul className="grid gap-2">
                        {p.bullets.map((b) => (
                          <li key={b.en} className="flex gap-2.5 text-sm text-fg/85">
                            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-acid" />
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
                            className="ml-auto rounded-lg border border-acid/50 px-3 py-1.5 font-mono text-[11px] text-acid transition-colors hover:bg-acid hover:text-bg"
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
    </Section>
  );
}
