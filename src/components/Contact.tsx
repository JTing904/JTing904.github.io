"use client";

import { profile, ui } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

export default function Contact() {
  const { t, lang } = useStore();
  const en = lang === "en";

  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", value: "github.com/JTing904", href: profile.github },
  ];

  return (
    <Section id="contact" index="06" title={ui.sectionContact}>
      <div className="reveal overflow-hidden rounded-2xl border border-line bg-bg-2/70">
        <div className="border-b border-line/70 px-5 py-3 font-mono text-[11px] text-muted">
          $ cat contact.json
        </div>
        <div className="grid gap-px bg-line/60 sm:grid-cols-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group bg-bg-2 p-5 transition-colors hover:bg-surface sm:p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {l.label}
              </p>
              <p className="mt-1.5 break-all font-mono text-sm text-fg transition-colors group-hover:text-acid">
                {l.value}
              </p>
            </a>
          ))}
        </div>
        <div className="border-t border-line/70 px-5 py-4 sm:px-6">
          <p className="text-pretty text-sm text-muted">
            {en
              ? "Open to internships and junior roles in backend or mobile. Based in Malaysia, happy to work remote."
              : "正在找后端或移动端的实习与初级职位。人在马来西亚，远程也可以。"}
          </p>
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-[11px] text-muted/70">
        {en
          ? "Built with Next.js, React 19 and Tailwind v4 · view transitions, scroll-driven animations, canvas"
          : "用 Next.js、React 19 和 Tailwind v4 做的 · View Transitions、滚动驱动动画、Canvas"}
      </p>
    </Section>
  );
}
