"use client";

import { useEffect, useRef } from "react";
import { person, ui } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";
import s from "./Hero.module.css";

const LINES = ["Tan Keng", "Ting"];
const DIGITS = "0123456789";

/** Letters arrive as scrambling digits, then each one widens and thickens as the cursor passes. */
export default function Hero({ start }: { start: boolean }) {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);

  // kinetic width/weight
  useEffect(() => {
    const el = name.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-ch]"));
    const state = chars.map(() => ({ w: 88, g: 680 }));
    chars.forEach((c) => { c.style.fontVariationSettings = `"wdth" 88, "wght" 680`; });
    let mx = -9999, my = -9999, lastMove = 0;
    const fine = matchMedia("(pointer: fine)").matches;
    const still = reducedMotion();

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; lastMove = performance.now(); };
    window.addEventListener("pointermove", onMove, { passive: true });

    // only animate while the name is on screen; read letter centres every few frames, not every frame
    let visible = true, frameNo = 0;
    const centres = chars.map(() => ({ x: 0, y: 0 }));
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);

    const tick = (time: number) => {
      if (still || !visible) return;
      const idle = !fine || performance.now() - lastMove > 2600;
      if (!idle && frameNo++ % 6 === 0) {
        chars.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          centres[i].x = r.left + r.width / 2;
          centres[i].y = r.top + r.height / 2;
        });
      }
      chars.forEach((c, i) => {
        let k: number;
        if (idle) {
          k = 0.18 + 0.18 * Math.sin(time * 1.3 - i * 0.55);
        } else {
          const d = Math.hypot(mx - centres[i].x, my - centres[i].y);
          k = Math.exp(-((d / 300) ** 2));
        }
        const st = state[i];
        const nw = st.w + (88 + 37 * k - st.w) * 0.14;
        const ng = st.g + (620 + 280 * k - st.g) * 0.14;
        if (Math.abs(nw - st.w) < 0.03 && Math.abs(ng - st.g) < 0.3) return;
        st.w = nw; st.g = ng;
        c.style.fontVariationSettings = `"wdth" ${st.w.toFixed(1)}, "wght" ${st.g.toFixed(0)}`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // entrance
  useEffect(() => {
    const el = root.current;
    if (!el || !start) return;
    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-ch]"));
    const quick = reducedMotion();
    const timers: number[] = [];

    if (!quick) {
      chars.forEach((c, i) => {
        const final = c.dataset.ch!;
        const until = performance.now() + 520 + i * 55;
        const id = window.setInterval(() => {
          if (performance.now() > until) {
            c.textContent = final;
            clearInterval(id);
          } else c.textContent = DIGITS[(Math.random() * 10) | 0];
        }, 45);
        timers.push(id);
      });
    }

    const tl = gsap.timeline();
    tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: quick ? 0 : 1.25, stagger: 0.045, ease: "expo.out" })
      .fromTo(`.${s.reveal}`, { yPercent: 120 }, { yPercent: 0, duration: quick ? 0 : 1, stagger: 0.06, ease: "expo.out" }, 0.35)
      .fromTo(`.${s.rule}`, { scaleX: 0 }, { scaleX: 1, duration: quick ? 0 : 1.4, ease: "expo.inOut" }, 0.2);

    // drift up and away as you leave
    const st = gsap.to(name.current, {
      yPercent: -18, ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });

    return () => {
      timers.forEach(clearInterval);
      tl.kill();
      st.scrollTrigger?.kill();
      st.kill();
      ScrollTrigger.refresh();
    };
  }, [start]);

  return (
    <section ref={root} data-tone="light" className={s.hero} aria-label={person.name}>
      <h1 ref={name} className={s.name} aria-label={person.name}>
        {LINES.map((line, li) => (
          <span key={li} className={`${s.line} ${li === 1 ? s.right : ""}`} aria-hidden>
            {line.split(" ").map((word, wi) => (
              <span key={wi} className={s.word}>
                {Array.from(word).map((ch, i) => (
                  <span key={i} className={s.ch} data-ch={ch}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className={s.rule} />

      <div className={s.info}>
        <div className={s.col}>
          <span className="mask"><span className={`eyebrow ${s.reveal}`}>{t(person.role)}</span></span>
          <span className="mask"><span className={`${s.lead} ${s.reveal}`}>{t(person.intro)}</span></span>
        </div>
        <div className={`${s.col} ${s.colRight}`}>
          <span className="mask"><span className={`eyebrow ${s.reveal}`}>{t(person.status)}</span></span>
          <span className="mask">
            <span className={`eyebrow ${s.reveal} ${s.scroll}`}>
              {t(ui.scroll)} <i aria-hidden />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
