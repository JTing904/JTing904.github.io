"use client";

import { AnimatePresence, motion } from "motion/react";
import { ui } from "@/lib/content";
import { ACHIEVEMENTS, useStore } from "@/lib/store";

export default function Toasts() {
  const { toasts, dismissToast, t } = useStore();

  return (
    <div className="no-print pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const a = ACHIEVEMENTS[toast.achievement];
          return (
            <motion.button
              key={toast.id}
              type="button"
              onClick={() => dismissToast(toast.id)}
              initial={{ opacity: 0, y: 26, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-center gap-3 overflow-hidden rounded-xl border border-amber/40 bg-bg-2/95 px-3 py-2.5 text-left shadow-2xl backdrop-blur"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber/15 font-mono text-sm text-amber">
                {a.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
                  {t(ui.unlocked)}
                </span>
                <span className="block truncate text-sm font-medium">{t(a.title)}</span>
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
