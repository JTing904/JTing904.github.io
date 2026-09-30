"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cards, projects, ui, type Card } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { getLenis, gsap, reducedMotion, ScrollTrigger, scrollToY } from "@/lib/motion";
import { css, extract, hex, mix, type Palette } from "@/lib/palette";
import { asset } from "@/lib/asset";
import baked from "@/lib/palettes.json";
import s from "./Work.module.css";

const MAX_ROT = 28;      // deg, a card one step from centre
const MAX_DEPTH = 140;   // px pushed back per step
const MIN_SCALE = 0.92;
const GAP = 28;
const GREY: Palette = [[70, 74, 82], [52, 55, 62], [18, 19, 22]];

function Cover({ card }: { card: Extract<Card, { kind: "cover" }> }) {
  const [a, b, c] = card.colors;
  const style = { background: `radial-gradient(120% 80% at 20% 10%, ${a}, transparent 60%), radial-gradient(90% 70% at 90% 90%, ${b}, transparent 65%), ${c}` };
  if (card.project === "ml")
    return (
      <div className={s.cover} style={style}>
        <span className="eyebrow">scikit-learn</span>
        <b className={s.coverBig}>LR</b>
        <span className={s.coverRows}>
          <span>Low</span><span>Medium</span><span>High</span>
        </span>
        <span className="eyebrow">19 features · stratified CV</span>
      </div>
    );
  return null;
}

export default function Work() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const n = cards.length;
  const palettes = useRef<Palette[]>(
    cards.map((c) => (c.kind === "cover" ? (c.colors.map(hex) as Palette) : ((baked as Record<string, Palette>)[c.src] ?? GREY))),
  );
  const byProject = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), []);

  useEffect(() => {
    const sec = section.current, pinEl = pin.current, stg = stage.current, cv = bg.current;
    if (!sec || !pinEl || !stg || !cv) return;
    const els = Array.from(stg.querySelectorAll<HTMLElement>(`.${s.card}`));
    const shades = els.map((el) => el.querySelector<HTMLElement>(`.${s.shade}`));
    const glowSet: (Palette | null)[] = els.map(() => null);
    const still = reducedMotion();

    // colours are baked at build time; re-read them live when the image host allows it
    cards.forEach((c, i) => {
      if (c.kind !== "shot") return;
      const probe = new Image();
      probe.crossOrigin = "anonymous";
      probe.onload = () => { try { palettes.current[i] = extract(probe); } catch {} };
      probe.src = asset(c.src);
    });

    let target = 0, pos = 0, lastActive = -1;
    const perCard = () => window.innerHeight * 0.62;

    const st = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: () => `+=${(n - 1) * perCard()}`,
      pin: pinEl,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => { target = self.progress * (n - 1); },
    });

    const yFor = (i: number) => st.start + i * perCard();

    // drag = scroll, so there is only one source of truth
    let dragging = false, sx = 0, sy = 0, moved = 0;
    const cardStep = () => (els[0]?.offsetWidth ?? 300) + GAP;
    const down = (e: PointerEvent) => {
      dragging = true; moved = 0; sx = e.clientX; sy = window.scrollY;
      stg.setPointerCapture(e.pointerId);
      stg.classList.add(s.grabbing);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      const y = Math.min(st.end, Math.max(st.start, sy - (dx / cardStep()) * perCard()));
      scrollToY(y, true);
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stg.classList.remove(s.grabbing);
      try { stg.releasePointerCapture(e.pointerId); } catch {}
      if (moved < 6) {
        const hit = (e.target as HTMLElement).closest<HTMLElement>(`.${s.card}`);
        if (hit) scrollToY(yFor(Number(hit.dataset.i)));
        return;
      }
      scrollToY(yFor(Math.round(target)));
    };
    stg.addEventListener("pointerdown", down);
    stg.addEventListener("pointermove", move);
    stg.addEventListener("pointerup", up);
    stg.addEventListener("pointercancel", up);

    // settle on the nearest card once scrolling stops
    let idle = 0;
    const onScroll = () => {
      clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (dragging || !st.isActive) return;
        const y = yFor(Math.round(target));
        if (Math.abs(y - window.scrollY) > 3) scrollToY(y);
      }, 170);
    };
    const lenis = getLenis();
    if (lenis) lenis.on("scroll", onScroll); else window.addEventListener("scroll", onScroll, { passive: true });

    const key = (e: KeyboardEvent) => {
      if (!st.isActive) return;
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToY(yFor(Math.min(n - 1, Math.round(target) + 1))); }
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollToY(yFor(Math.max(0, Math.round(target) - 1))); }
    };
    window.addEventListener("keydown", key);

    // background field
    const ctx = cv.getContext("2d")!;
    const W = 64, H = 36;
    cv.width = W; cv.height = H;

    const frame = (time: number) => {
      pos += (target - pos) * (still ? 1 : 0.11);
      if (Math.abs(target - pos) < 0.0005) pos = target;

      // cards
      const w = els[0]?.offsetWidth ?? 300;
      const near = w * 0.96 + GAP, far = w * 0.78 + GAP;
      els.forEach((el, i) => {
        const d = i - pos, ad = Math.abs(d), sg = Math.sign(d);
        const x = sg * (Math.min(ad, 1) * near + Math.max(0, ad - 1) * far);
        const rot = sg * Math.min(ad, 1) * MAX_ROT;
        const z = -Math.min(ad, 2.4) * MAX_DEPTH;
        const sc = 1 - Math.min(ad, 1) * (1 - MIN_SCALE);
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.opacity = String(Math.max(0, Math.min(1, 3.6 - ad)));
        el.style.zIndex = String(100 - Math.round(ad * 10));
        const sh = shades[i];
        if (sh) sh.style.opacity = Math.min(0.55, ad * 0.28).toFixed(3);
        if (glowSet[i] !== palettes.current[i]) {
          glowSet[i] = palettes.current[i];
          el.style.setProperty("--glow", css(palettes.current[i][0], 0.55));
        }
      });

      // gradient
      const i0 = Math.max(0, Math.min(n - 1, Math.floor(pos)));
      const i1 = Math.min(n - 1, i0 + 1);
      const f = pos - i0;
      const A = palettes.current[i0], B = palettes.current[i1];
      const p1 = mix(A[0], B[0], f), p2 = mix(A[1], B[1], f), base = mix(A[2], B[2], f);
      ctx.fillStyle = css(base);
      ctx.fillRect(0, 0, W, H);
      const tt = still ? 0 : time;
      const blob = (cx: number, cy: number, r: number, c: [number, number, number], a: number) => {
        const g = ctx.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, r * W);
        g.addColorStop(0, css(c, a));
        g.addColorStop(1, css(c, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      };
      blob(0.28 + 0.1 * Math.sin(tt * 0.31), 0.32 + 0.12 * Math.cos(tt * 0.27), 0.62, p1, 0.95);
      blob(0.76 + 0.09 * Math.cos(tt * 0.23), 0.7 + 0.1 * Math.sin(tt * 0.29), 0.58, p2, 0.9);
      blob(0.52 + 0.14 * Math.sin(tt * 0.17 + 1), 1.05, 0.5, p1, 0.55);

      if (bar.current) bar.current.style.transform = `scaleX(${(pos / (n - 1)).toFixed(4)})`;
      const a = Math.round(pos);
      if (a !== lastActive) { lastActive = a; setActive(a); }
    };
    gsap.ticker.add(frame);

    return () => {
      gsap.ticker.remove(frame);
      st.kill();
      stg.removeEventListener("pointerdown", down);
      stg.removeEventListener("pointermove", move);
      stg.removeEventListener("pointerup", up);
      stg.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      if (lenis) lenis.off("scroll", onScroll); else window.removeEventListener("scroll", onScroll);
    };
  }, [n]);

  const card = cards[active];
  const proj = byProject[card.project];
  const count = (k: number) => String(k).padStart(2, "0");

  return (
    <section ref={section} id="work" data-tone="dark" className={s.work}>
      <div ref={pin} className={s.pin}>
        <canvas ref={bg} className={s.bg} aria-hidden />
        <div className={s.vignette} aria-hidden />

        <div className={s.top}>
          <span className="eyebrow">{t(ui.work)} · 2025 — 2026</span>
          <span className="eyebrow">{t(ui.drag)} ←→</span>
        </div>

        <div ref={stage} className={s.stage} data-cursor="drag" role="listbox" aria-label={t(ui.work)}>
          {cards.map((c, i) => (
            <div key={i} data-i={i} className={s.card} role="option" aria-selected={i === active}
              aria-label={`${byProject[c.project].name}, ${t(c.label)}`}>
              {c.kind === "shot" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(c.src)} alt="" draggable={false} decoding="async" />
              ) : (
                <Cover card={c} />
              )}
              <span className={s.shade} aria-hidden />
            </div>
          ))}
        </div>

        <div className={s.caption}>
          <div className={s.capLeft} key={proj.id}>
            <span className={s.capKind}><span className="eyebrow">{proj.year} · {t(proj.kind)}</span></span>
            <h2 className={s.capName}><span>{proj.name}</span></h2>
            <p className={s.capLine}>{t(proj.line)}</p>
            <div className={s.stack}>
              {proj.stack.map((x) => <span key={x}>{x}</span>)}
              {proj.href && <a href={proj.href} target="_blank" rel="noreferrer" className={s.src}>{t(ui.source)} ↗</a>}
            </div>
          </div>
          <div className={s.capRight}>
            <span className={`${s.idx} mono`}>
              <b key={active}>{count(active + 1)}</b>
              <span> / {count(n)}</span>
            </span>
            <span className="eyebrow">{t(card.label)}</span>
            <span className={s.track}><span ref={bar} /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
