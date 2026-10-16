"use client";

import { useEffect, useRef } from "react";
import { skills, ui } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { getLenis, gsap, reducedMotion } from "@/lib/motion";
import s from "./Skills.module.css";

const ROWS = [
  ["Kotlin", "Spring Boot", "Hono", "PostgreSQL", "Prisma", "Flyway", "Jetpack Compose"],
  ["React 19", "React Native", "Expo", "TypeScript", "Next.js", "Capacitor", "Firebase", "Cloudflare"],
  ["Python", "Godot", "Three.js", "Electron", "pandas", "scikit-learn", "SQL", "Java", "Figma"],
];

/** Three bands that drift on their own and surge, skewing, with scroll speed. */
export default function Skills() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>(`.${s.track}`));
    const still = reducedMotion();
    const offs = tracks.map(() => 0);
    let vel = 0, skew = 0;
    let lastY = window.scrollY;

    const frame = (_t: number, dt: number) => {
      if (still) return;
      const lenis = getLenis();
      const v = lenis ? lenis.velocity : window.scrollY - lastY;
      lastY = window.scrollY;
      vel += (v - vel) * 0.1;
      skew += (Math.max(-12, Math.min(12, vel * 0.6)) - skew) * 0.12;
      tracks.forEach((tr, i) => {
        const dir = i % 2 ? 1 : -1;
        const half = tr.scrollWidth / 2;
        offs[i] += dir * (0.04 * dt + Math.abs(vel) * 0.9);
        if (offs[i] <= -half) offs[i] += half;
        if (offs[i] > 0) offs[i] -= half;
        tr.style.transform = `translate3d(${offs[i].toFixed(1)}px,0,0) skewX(${(-skew * dir).toFixed(2)}deg)`;
      });
    };
    gsap.ticker.add(frame);
    return () => gsap.ticker.remove(frame);
  }, []);

  return (
    <section ref={root} data-tone="light" className={s.skills} aria-labelledby="skills-title">
      <div className={`${s.head} gutter`}>
        <h2 id="skills-title" className="eyebrow">{t(ui.skillsTitle)}</h2>
      </div>
      <div className={s.bands} aria-hidden>
        {ROWS.map((row, i) => (
          <div key={i} className={`${s.band} ${i === 1 ? s.outline : ""}`}>
            <div className={s.track}>
              {[...row, ...row].map((w, j) => (
                <span key={j} className={s.item}>{w}<i className={s.star}>✳</i></span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`${s.groups} gutter`}>
        {skills.map((g) => (
          <div key={g.group.en} className={s.group}>
            <span className="eyebrow">{t(g.group)}</span>
            <ul>{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
