"use client";

import { useEffect, useRef, useState } from "react";
import { person, ui } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { scrollToY } from "@/lib/motion";
import s from "./Nav.module.css";

function useKLTime() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kuala_Lumpur", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function go(id: string) {
  const el = document.getElementById(id);
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const time = useKLTime();
  const ref = useRef<HTMLElement>(null);

  // Read the tone of whatever section sits under the bar, so it never needs a blend mode.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = 28;
      const secs = document.querySelectorAll<HTMLElement>("[data-tone]");
      let tone = "dark";
      secs.forEach((el) => {
        if (el === ref.current) return;
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) tone = el.dataset.tone!;
      });
      if (ref.current) ref.current.dataset.tone = tone;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const id = setInterval(check, 500);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); clearInterval(id); };
  }, []);

  return (
    <header ref={ref} className={s.nav} data-tone="light">
      <button className={s.mark} onClick={() => scrollToY(0)} aria-label={`${person.name}, back to top`}>
        <b>KT</b>
        <span className={s.full}>{person.name}</span>
      </button>
      <span className={`${s.time} mono`} aria-label={t(ui.local)}>
        {t({ en: "Seremban", zh: "芙蓉" })} {time} <span className={s.tz}>GMT+8</span>
      </span>
      <nav className={s.links}>
        <button onClick={() => go("work")}>{t(ui.work)}</button>
        <button onClick={() => go("about")}>{t(ui.about)}</button>
        <button onClick={() => go("contact")}>{t(ui.contact)}</button>
        <button
          className={s.lang}
          onClick={() => setLang(lang === "en" ? "zh" : "en")}
          aria-label="Switch language"
        >
          <span data-on={lang === "en"}>EN</span>
          <span>/</span>
          <span data-on={lang === "zh"}>中</span>
        </button>
      </nav>
    </header>
  );
}
