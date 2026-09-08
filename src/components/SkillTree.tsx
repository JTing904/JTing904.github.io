"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { branchMeta, skills, ui, type SkillNode } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

const BRANCHES = Object.keys(branchMeta) as SkillNode["branch"][];

export default function SkillTree() {
  const { t, unlock } = useStore();
  const [active, setActive] = useState<SkillNode>(skills[1]);

  return (
    <Section id="skills" index="02" title={ui.sectionSkills}>
      <p className="reveal mb-6 font-mono text-xs text-muted">{t(ui.clickNode)}</p>

      <div className="reveal grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {BRANCHES.map((branch) => {
          const meta = branchMeta[branch];
          const nodes = skills
            .filter((s) => s.branch === branch)
            .sort((a, b) => a.tier - b.tier);
          return (
            <div key={branch} className="relative">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[11px]"
                style={{ borderColor: meta.color, color: meta.color }}
              >
                <span className="size-1.5 rounded-full" style={{ background: meta.color }} />
                {t(meta.label)}
              </div>

              <div className="relative pl-4">
                <span
                  aria-hidden
                  className="absolute left-[3px] top-1 bottom-3 w-px"
                  style={{
                    background: `linear-gradient(to bottom, ${meta.color}, transparent)`,
                    opacity: 0.45,
                  }}
                />
                <ul className="grid gap-2">
                  {nodes.map((node) => {
                    const on = active.id === node.id;
                    return (
                      <li key={node.id} className="relative">
                        <span
                          aria-hidden
                          className="absolute -left-4 top-1/2 h-px w-3"
                          style={{ background: meta.color, opacity: 0.45 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setActive(node);
                            unlock("skiller");
                          }}
                          aria-pressed={on}
                          className={`w-full rounded-lg border px-2.5 py-2 text-left font-mono text-xs transition-all duration-200 ${
                            on
                              ? "border-transparent text-bg"
                              : "border-line bg-surface/50 text-fg/85 hover:border-current hover:text-fg"
                          }`}
                          style={
                            on
                              ? { background: meta.color, boxShadow: `0 0 26px -6px ${meta.color}` }
                              : undefined
                          }
                        >
                          <span className="flex items-center justify-between gap-2">
                            {node.label}
                            <span className="opacity-60">
                              {"·".repeat(node.tier + 1)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="reveal mt-8 min-h-[5.5rem] rounded-2xl border border-line bg-bg-2/70 p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <p
              className="font-mono text-sm font-semibold"
              style={{ color: branchMeta[active.branch].color }}
            >
              {active.label}
            </p>
            <p className="mt-1.5 text-pretty text-sm text-muted">{t(active.note)}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
