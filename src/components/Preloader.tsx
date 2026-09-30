"use client";

import { useEffect, useRef, useState } from "react";
import { cards, person } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { ui } from "@/lib/content";
import { gsap, lockScroll, reducedMotion } from "@/lib/motion";
import { asset } from "@/lib/asset";
import s from "./Preloader.module.css";

/**
 * Counts to 100 against real image loading (with a floor so it never just blinks),
 * then wipes upward to reveal the page.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    lockScroll(true);
    const srcs = cards.flatMap((c) => (c.kind === "shot" ? [c.src] : []));
    let loaded = 0;
    srcs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; };
      img.src = asset(src);
    });

    const quick = reducedMotion();
    const minMs = quick ? 200 : 1500;
    const t0 = performance.now();
    let shown = 0;
    let raf = 0;
    let finished = false;

    const finish = () => {
      finished = true;
      const el = root.current;
      if (!el) return;
      const tl = gsap.timeline({
        onComplete: () => {
          lockScroll(false);
          setGone(true);
        },
      });
      if (quick) {
        tl.to(el, { opacity: 0, duration: 0.3 });
        onDone();
      } else {
        tl.to(`.${s.count}`, { yPercent: -110, duration: 0.7, ease: "expo.in" })
          .to(`.${s.meta}`, { opacity: 0, duration: 0.3 }, "<")
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" }, "-=0.15")
          .add(onDone, "-=0.65");
      }
    };

    const loop = () => {
      const elapsed = performance.now() - t0;
      const real = srcs.length ? loaded / srcs.length : 1;
      const timeCap = Math.min(1, elapsed / minMs);
      const target = Math.min(real, timeCap) * 100;
      shown += (target - shown) * 0.12;
      if (target >= 100 && shown > 99.4) shown = 100;
      if (num.current) num.current.textContent = String(Math.floor(shown)).padStart(3, "0");
      if (shown >= 100 && !finished) return finish();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className={s.root} aria-hidden>
      <div className={s.meta}>
        <span className="eyebrow">{person.name}</span>
        <span className="eyebrow">{t(ui.loading)}</span>
        <span className="eyebrow">Portfolio 2026</span>
      </div>
      <div className={s.countWrap}>
        <span className={s.count}>
          <span ref={num} className="mono">000</span>
        </span>
      </div>
    </div>
  );
}
