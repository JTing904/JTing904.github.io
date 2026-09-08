"use client";

import type { ReactNode } from "react";
import type { L } from "@/lib/content";
import { useStore } from "@/lib/store";

export default function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: L;
  children: ReactNode;
}) {
  const { t } = useStore();
  return (
    <section id={id} className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="reveal mb-8 flex items-baseline gap-3 border-b border-line/70 pb-3">
          <span className="font-mono text-xs text-acid">{index}</span>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{t(title)}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
