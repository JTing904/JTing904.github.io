"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { L, Lang } from "./content";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (s: L) => string };
const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (s) => s.en });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "zh") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }, []);

  const t = useCallback((s: L) => s[lang], [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
