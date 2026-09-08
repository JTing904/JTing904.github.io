"use client";

import { useEffect, useRef } from "react";

/**
 * One pointer listener drives three effects:
 *  - a two-part custom cursor (instant dot + lagging ring)
 *  - magnetic pull on [data-magnetic] elements
 *  - a spotlight highlight on [data-spotlight] cards (via CSS custom props)
 *
 * Disabled entirely on coarse pointers and for prefers-reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let scale = 1;
    let targetScale = 1;
    let magnet: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;

      const el = e.target as HTMLElement | null;
      const spot = el?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const next = el?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (next !== magnet) {
        if (magnet) magnet.style.transform = "";
        magnet = next;
      }
      targetScale = next || el?.closest("a,button,input") ? 2.1 : 1;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = Math.max(-14, Math.min(14, (x - cx) * 0.3));
        const dy = Math.max(-10, Math.min(10, (y - cy) * 0.3));
        magnet.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      }
    };
    raf = requestAnimationFrame(tick);

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (magnet) magnet.style.transform = "";
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring no-print" />
      <div ref={dotRef} aria-hidden className="cursor-dot no-print" />
    </>
  );
}
