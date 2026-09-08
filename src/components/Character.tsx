"use client";

import { motion } from "motion/react";
import { profile, stats, ui } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

export default function Character() {
  const { t, lang } = useStore();

  return (
    <Section id="about" index="01" title={ui.sectionAbout}>
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="reveal rounded-2xl border border-line bg-bg-2/70 p-5 sm:p-7">
          <p className="text-pretty text-base leading-relaxed text-fg/90 sm:text-lg">
            {t(profile.about)}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs sm:grid-cols-3">
            <div>
              <dt className="text-muted">{lang === "en" ? "Class" : "职业"}</dt>
              <dd className="mt-1 text-fg">{lang === "en" ? "Undergraduate" : "在读本科生"}</dd>
            </div>
            <div>
              <dt className="text-muted">{lang === "en" ? "Base" : "所在地"}</dt>
              <dd className="mt-1 text-fg">{t(profile.location)}</dd>
            </div>
            <div>
              <dt className="text-muted">{lang === "en" ? "Focus" : "方向"}</dt>
              <dd className="mt-1 text-acid">{lang === "en" ? "Backend" : "后端"}</dd>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-muted">{lang === "en" ? "Spoken" : "语言"}</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {profile.spoken.map((s) => (
                  <span
                    key={s.en}
                    className="rounded border border-line px-2 py-0.5 text-fg/85"
                  >
                    {t(s)}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="reveal rounded-2xl border border-line bg-bg-2/70 p-5 sm:p-7">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {lang === "en" ? "Attributes" : "属性"} · {t(ui.selfRated)}
          </p>
          <ul className="grid gap-4">
            {stats.map((s, i) => (
              <li key={s.key.en}>
                <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs">
                  <span className="text-fg/90">{t(s.key)}</span>
                  <span className="text-muted">{s.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: s.value / 100 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.06 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "0% 50%" }}
                    className="h-full rounded-full bg-gradient-to-r from-acid to-violet"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
