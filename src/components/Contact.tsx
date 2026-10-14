"use client";

import { useRef, useState } from "react";
import { person, ui } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { scrollToY } from "@/lib/motion";
import s from "./Contact.module.css";

const GLYPHS = "0123456789@.";

/** The address scrambles through digits on hover and settles back, one letter at a time. */
function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const running = useRef(false);
  const run = () => {
    const el = ref.current;
    if (!el || running.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const chars = Array.from(text);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      el.textContent = chars
        .map((c, i) => (i < frame / 1.6 ? c : c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join("");
      if (frame / 1.6 >= chars.length) { clearInterval(id); el.textContent = text; running.current = false; }
    }, 28);
  };
  return <span ref={ref} onPointerEnter={run} onFocus={run}>{text}</span>;
}

export default function Contact() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <footer id="contact" data-tone="dark" className={s.contact}>
      <div className={`${s.top} gutter`}>
        <span className="eyebrow">{t(ui.say)}</span>
        <span className="eyebrow">{t(person.status)}</span>
      </div>
      <a className={`${s.mail} gutter`} href={`mailto:${person.email}`} data-cursor="link">
        <Scramble text={person.email} />
      </a>
      <div className={`${s.actions} gutter`}>
        <button className={s.btn} onClick={copy}>{copied ? t(ui.copied) : t(ui.copy)}</button>
        <a className={s.btn} href={person.github} target="_blank" rel="noreferrer">{person.githubLabel} ↗</a>
        <a className={s.btn} href={person.instagram} target="_blank" rel="noreferrer">Instagram {person.instagramLabel} ↗</a>
      </div>
      <div className={`${s.base} gutter`}>
        <span className="mono">© 2026 {person.name}</span>
        <span className="mono">{t(person.city)}</span>
        <span className="mono">Next.js · GSAP · Lenis</span>
        <button className="mono" onClick={() => scrollToY(0)}>↑ Top</button>
      </div>
    </footer>
  );
}
