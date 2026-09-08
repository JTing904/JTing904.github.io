"use client";

import { branchMeta, profile, projects, skills, timeline } from "@/lib/content";
import { useStore } from "@/lib/store";

const BRANCHES = Object.keys(branchMeta) as (keyof typeof branchMeta)[];

export default function Resume() {
  const { t, lang } = useStore();
  const en = lang === "en";

  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-3 border-b border-line pb-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
      {children}
    </h2>
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-9">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
        <p className="mt-1 text-base text-muted">{t(profile.role)}</p>
        <p className="mt-3 font-mono text-xs text-muted">
          {t(profile.location)} ·{" "}
          <a className="underline underline-offset-2 hover:text-fg" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>{" "}
          ·{" "}
          <a
            className="underline underline-offset-2 hover:text-fg"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/JTing904
          </a>
        </p>
      </header>

      <section className="mb-8">
        <H>{en ? "Profile" : "个人简介"}</H>
        <p className="text-pretty text-sm leading-relaxed">{t(profile.about)}</p>
      </section>

      <section className="mb-8">
        <H>{en ? "Education & Experience" : "学历与经历"}</H>
        <ul className="grid gap-5">
          {timeline.map((item) => (
            <li key={item.period + item.title.en}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-sm font-semibold">{t(item.title)}</h3>
                <span className="font-mono text-[11px] text-muted">{item.period}</span>
              </div>
              <p className="text-xs text-muted">{t(item.org)}</p>
              <ul className="mt-1.5 grid gap-1 pl-4">
                {item.bullets.map((b) => (
                  <li key={b.en} className="list-disc text-sm text-fg/85 marker:text-muted">
                    {t(b)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <H>{en ? "Projects" : "项目"}</H>
        <ul className="grid gap-5">
          {projects.map((p) => (
            <li key={p.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-sm font-semibold">
                  {p.name}
                  <span className="ml-2 font-normal text-muted">{t(p.rank)}</span>
                </h3>
                <span className="font-mono text-[11px] text-muted">{p.year}</span>
              </div>
              <p className="mt-0.5 text-sm text-fg/85">{t(p.summary)}</p>
              <ul className="mt-1.5 grid gap-1 pl-4">
                {p.bullets.map((b) => (
                  <li key={b.en} className="list-disc text-sm text-fg/85 marker:text-muted">
                    {t(b)}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 font-mono text-[11px] text-muted">
                {p.stack.join(" · ")}
                {p.href ? ` · ${p.href}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <H>{en ? "Skills" : "技能"}</H>
        <dl className="grid gap-2">
          {BRANCHES.map((b) => (
            <div key={b} className="flex gap-3 text-sm">
              <dt className="w-32 shrink-0 font-mono text-xs text-muted">
                {t(branchMeta[b].label)}
              </dt>
              <dd className="text-fg/85">
                {skills
                  .filter((s) => s.branch === b)
                  .map((s) => s.label)
                  .join(", ")}
              </dd>
            </div>
          ))}
          <div className="flex gap-3 text-sm">
            <dt className="w-32 shrink-0 font-mono text-xs text-muted">
              {en ? "Spoken" : "语言"}
            </dt>
            <dd className="text-fg/85">{profile.spoken.map((s) => t(s)).join(", ")}</dd>
          </div>
        </dl>
      </section>

      <p className="no-print mt-10 text-center font-mono text-[11px] text-muted">
        {en ? "Press ⌘/Ctrl + P to save this as a PDF." : "按 ⌘/Ctrl + P 可以直接存成 PDF。"}
      </p>
    </main>
  );
}
