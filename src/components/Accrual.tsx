"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { gsap, reducedMotion } from "@/lib/motion";
import s from "./Accrual.module.css";

// Dividend Stream's own example: RM320.00 earned across 182 days.
// Integer maths in units of RM 0.00000001, rounded down, like the app.
const RATE_UNITS = BigInt(2035); // 0.00002035 per second
const CAP = BigInt(320) * BigInt(100000000);
const E8 = BigInt(100000000);

function format(u: bigint) {
  const whole = u / E8;
  const frac = (u % E8).toString().padStart(8, "0");
  return `${whole}.${frac}`;
}

function Digit({ ch, dim }: { ch: string; dim: boolean }) {
  if (ch === ".") return <span className={`${s.dot} ${dim ? s.dim : ""}`}>.</span>;
  const n = Number(ch);
  return (
    <span className={`${s.digit} ${dim ? s.dim : ""}`} aria-hidden>
      <span className={s.reel} style={{ transform: `translateY(${-n * 10}%)` }}>
        {"0123456789".split("").map((d) => <span key={d}>{d}</span>)}
      </span>
    </span>
  );
}

/** The one number that explains Dividend Stream, running live on the page. */
export default function Accrual() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const t0 = useRef<number | null>(null);
  const [value, setValue] = useState("0.00000000");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const slow = reducedMotion();
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && t0.current === null) t0.current = performance.now();
    }, { threshold: 0.2 });
    io.observe(el);
    timer = window.setInterval(() => {
      if (t0.current === null) return;
      const ms = BigInt(Math.floor(performance.now() - t0.current));
      let u = (ms * RATE_UNITS) / BigInt(1000);
      if (u > CAP) u = CAP;
      setValue(format(u));
    }, slow ? 1000 : 80);

    const ctx = gsap.context(() => {
      if (slow) return;
      gsap.from(`.${s.row}`, {
        yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);
    return () => { io.disconnect(); clearInterval(timer); ctx.revert(); };
  }, []);

  const chars = Array.from(value);
  const firstSig = chars.findIndex((c) => c !== "0" && c !== ".");
  return (
    <section ref={root} data-tone="dark" className={s.acc} aria-label={t(ui.accrualTitle)}>
      <div className={`${s.row} ${s.head}`}>
        <span className="eyebrow">{t(ui.accrualTitle)}</span>
        <span className="eyebrow mono">Dividend Stream</span>
      </div>
      <div className={`${s.row} ${s.figure}`} role="img" aria-label={`RM ${value}`}>
        <span className={s.cur}>RM</span>
        {chars.map((c, i) => <Digit key={i} ch={c} dim={firstSig === -1 || i < firstSig} />)}
      </div>
      <div className={`${s.row} ${s.foot}`}>
        <code className={`mono ${s.formula}`}>accrued(t) = min(elapsed × rate, expected)</code>
        <span className="mono">rate 0.00002035 / s · expected 320.00</span>
      </div>
      <p className={`${s.row} ${s.note}`}>{t(ui.accrualNote)}</p>
    </section>
  );
}
