"use client";

import { useEffect, useRef } from "react";
import { statement } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { gsap, reducedMotion } from "@/lib/motion";
import s from "./Statement.module.css";

/** A dark sheet that rises over the hero; its words light up in reading order as you scroll. */
export default function Statement() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);
  const text = t(statement);
  const tokens = lang === "zh" ? Array.from(text) : text.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    const words = el.querySelectorAll(`.${s.w}`);
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { borderTopLeftRadius: "48px", borderTopRightRadius: "48px" }, {
        borderTopLeftRadius: "0px", borderTopRightRadius: "0px", ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
      });
      gsap.fromTo(words, { opacity: 0.14 }, {
        opacity: 1, ease: "none", stagger: 0.08,
        scrollTrigger: { trigger: `.${s.text}`, start: "top 78%", end: "bottom 42%", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [lang]);

  return (
    <section ref={root} id="about" data-tone="dark" className={s.sheet}>
      <span className="eyebrow" style={{ color: "var(--muted-dark)" }}>
        {lang === "zh" ? "关于" : "About"}
      </span>
      <p className={s.text}>
        {tokens.map((w, i) => (
          <span key={`${lang}-${i}`} className={s.w}>
            {w}
            {lang === "zh" ? "" : " "}
          </span>
        ))}
      </p>
    </section>
  );
}
