"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useScroll, useVelocity, useSpring, useAnimationFrame } from "motion/react";

const ROW_A = [
  "Kotlin",
  "TypeScript",
  "Java",
  "Python",
  "SQL",
  "Spring Boot",
  "PostgreSQL",
  "Jetpack Compose",
  "Android",
];
const ROW_B = [
  "React 19",
  "Next.js",
  "Tailwind",
  "Vite",
  "Capacitor",
  "Firebase",
  "Flyway",
  "scikit-learn",
  "Gradle",
  "Git",
];

function Row({ items, baseSpeed }: { items: string[]; baseSpeed: number }) {
  const x = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 320 });

  useEffect(() => {
    const measure = () => {
      if (ref.current) widthRef.current = ref.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    const w = widthRef.current;
    if (!w) return;
    // scroll velocity pushes the strip along — it feels connected to the page
    const boost = Math.max(-3, Math.min(3, smooth.get() / 900));
    let next = x.get() - (baseSpeed + baseSpeed * boost) * (delta / 1000);
    if (next <= -w) next += w;
    if (next > 0) next -= w;
    x.set(next);
    if (ref.current) ref.current.style.transform = `translate3d(${next.toFixed(2)}px,0,0)`;
  });

  return (
    <div className="overflow-hidden py-1">
      <div ref={ref} className="flex w-max items-center gap-8 will-change-transform">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="whitespace-nowrap font-mono text-sm text-muted/70">{item}</span>
            <span className="size-1 shrink-0 rounded-full bg-acid/50" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      aria-hidden
      className="no-print relative overflow-hidden border-y border-line/60 bg-bg-2/40 py-3"
    >
      <Row items={ROW_A} baseSpeed={38} />
      <Row items={ROW_B} baseSpeed={-26} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
