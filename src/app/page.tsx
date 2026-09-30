"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import Accrual from "@/components/Accrual";
import Skills from "@/components/Skills";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Chrome from "@/components/Chrome";
import { ScrollTrigger, startSmooth } from "@/lib/motion";

export default function Page() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    startSmooth();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Nav />
      <main>
        <Hero start={ready} />
        <Statement />
        <Work />
        <Accrual />
        <Skills />
        <Journey />
      </main>
      <Contact />
      <Chrome />
    </>
  );
}
