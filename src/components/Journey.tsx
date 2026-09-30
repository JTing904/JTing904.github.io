"use client";

import { useEffect, useRef } from "react";
import { journey, ui } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { gsap, reducedMotion } from "@/lib/motion";
import s from "./Journey.module.css";

export default function Journey() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(`.${s.row}`).forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
        tl.fromTo(row.querySelector(`.${s.line}`), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" })
          .fromTo(row.querySelectorAll(`.${s.cell} > span`), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.06 }, 0.25);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-tone="light" className={`${s.journey} gutter`} aria-labelledby="journey-title">
      <h2 id="journey-title" className="eyebrow">{t(ui.journeyTitle)}</h2>
      <ol className={s.list}>
        {journey.map((j, i) => (
          <li key={i} className={s.row}>
            <span className={s.line} aria-hidden />
            <span className={`${s.cell} ${s.when} mono`}><span>{j.when}</span></span>
            <span className={`${s.cell} ${s.what}`}><span>{t(j.what)}</span></span>
            <span className={`${s.cell} ${s.where}`}><span>{t(j.where)}</span></span>
          </li>
        ))}
      </ol>
    </section>
  );
}
