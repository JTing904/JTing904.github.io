"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

/** Film grain and a small blended cursor that grows over links and the carousel. */
export default function Chrome() {
  const grain = useRef<HTMLDivElement>(null);
  const cur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // grain tile, generated once
    const c = document.createElement("canvas");
    c.width = c.height = 140;
    const x = c.getContext("2d")!;
    const img = x.createImageData(140, 140);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    if (grain.current) grain.current.style.backgroundImage = `url(${c.toDataURL()})`;

    const el = cur.current;
    if (!el || !matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      const t = e.target as HTMLElement;
      const drag = t.closest('[data-cursor="drag"]');
      const link = t.closest('a, button, [data-cursor="link"]');
      el.classList.toggle("is-drag", !!drag);
      el.classList.toggle("is-link", !drag && !!link);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <div ref={grain} className="grain" aria-hidden />
      <div ref={cur} className="cursor" aria-hidden><span>Drag</span></div>
    </>
  );
}
