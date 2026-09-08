"use client";

import { timeline, ui } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

const KIND = {
  edu: { icon: "◆", color: "var(--color-acid)", label: { en: "Education", zh: "学历" } },
  work: { icon: "■", color: "var(--color-violet)", label: { en: "Work", zh: "工作" } },
  cca: { icon: "●", color: "var(--color-amber)", label: { en: "Activity", zh: "课外" } },
} as const;

export default function Journey() {
  const { t } = useStore();

  return (
    <Section id="journey" index="04" title={ui.sectionJourney}>
      <ol className="relative grid gap-4 pl-7 sm:pl-9">
        <span
          aria-hidden
          className="draw-line absolute left-[10px] top-2 bottom-2 w-px bg-gradient-to-b from-acid via-violet to-transparent sm:left-3"
        />
        {timeline.map((item) => {
          const k = KIND[item.kind];
          return (
            <li key={item.period + item.title.en} className="reveal relative">
              <span
                aria-hidden
                className="absolute -left-7 top-5 grid size-5 place-items-center rounded-full border border-line bg-bg text-[9px] sm:-left-9"
                style={{ color: k.color }}
              >
                {k.icon}
              </span>

              <div className="rounded-2xl border border-line bg-bg-2/70 p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-[11px] text-muted">{item.period}</span>
                  <span
                    className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                    style={{ borderColor: k.color, color: k.color }}
                  >
                    {t(k.label)}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">{t(item.title)}</h3>
                <p className="mt-0.5 font-mono text-xs text-muted">{t(item.org)}</p>
                <ul className="mt-3 grid gap-1.5">
                  {item.bullets.map((b) => (
                    <li key={b.en} className="flex gap-2.5 text-sm text-fg/80">
                      <span
                        className="mt-[7px] size-1 shrink-0 rounded-full"
                        style={{ background: k.color }}
                      />
                      <span className="text-pretty">{t(b)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
