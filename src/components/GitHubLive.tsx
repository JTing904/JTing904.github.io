"use client";

import { useEffect, useMemo, useState } from "react";
import { profile, ui } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

/**
 * Real data, pulled from the public GitHub API in the visitor's browser.
 * No token, no backend — so it is rate-limited per IP and can fail; every
 * path below degrades to something honest rather than to a blank box.
 */

const USER = "JTing904";
const CACHE_KEY = "ejt.gh.v1";
const TTL = 30 * 60 * 1000;

/** Categorical palette — validated for CVD separation and 3:1 contrast on the dark surface. */
const LANG_COLORS = ["#45AE4D", "#7A5FE0", "#B08020", "#4079D6", "#D45A66", "#5B6478"];

/** Sequential ramp for the activity grid: one hue, monotonically lighter. */
const HEAT = ["#1b2233", "#26492e", "#2f6a37", "#3c9243", "#57c25c"];

type Repo = {
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

type Data = {
  repos: number;
  followers: number;
  stars: number;
  langs: { name: string; count: number }[];
  recent: { name: string; url: string; at: string }[];
  days: Record<string, number>;
  pushes: number;
};

function relative(iso: string, en: boolean) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return en ? "today" : "今天";
  if (d === 1) return en ? "yesterday" : "昨天";
  if (d < 30) return en ? `${d}d ago` : `${d} 天前`;
  const m = Math.floor(d / 30);
  if (m < 12) return en ? `${m}mo ago` : `${m} 个月前`;
  return en ? `${Math.floor(m / 12)}y ago` : `${Math.floor(m / 12)} 年前`;
}

async function load(): Promise<Data> {
  const [userRes, repoRes, eventRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`),
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
    fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`),
  ]);
  if (!userRes.ok || !repoRes.ok) throw new Error("github");

  const user = (await userRes.json()) as { public_repos: number; followers: number };
  const repos = (await repoRes.json()) as Repo[];
  const events = eventRes.ok
    ? ((await eventRes.json()) as { type: string; created_at: string; payload?: { size?: number } }[])
    : [];

  const owned = repos.filter((r) => !r.fork);
  const langCount = new Map<string, number>();
  for (const r of owned) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);

  const days: Record<string, number> = {};
  let pushes = 0;
  for (const e of events) {
    if (e.type !== "PushEvent") continue;
    const n = e.payload?.size ?? 1;
    pushes += n;
    const key = new Date(e.created_at).toISOString().slice(0, 10);
    days[key] = (days[key] ?? 0) + n;
  }

  return {
    repos: user.public_repos,
    followers: user.followers,
    stars: owned.reduce((a, r) => a + r.stargazers_count, 0),
    langs: [...langCount.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    recent: owned.slice(0, 4).map((r) => ({ name: r.name, url: r.html_url, at: r.pushed_at })),
    days,
    pushes,
  };
}

export default function GitHubLive() {
  const { lang } = useStore();
  const en = lang === "en";
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState<{ date: string; n: number; x: number; y: number } | null>(null);

  useEffect(() => {
    let alive = true;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { t, d } = JSON.parse(raw) as { t: number; d: Data };
        if (Date.now() - t < TTL) {
          setData(d);
          return;
        }
      }
    } catch {
      /* cache is a nicety */
    }
    load()
      .then((d) => {
        if (!alive) return;
        setData(d);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d }));
        } catch {
          /* ignore */
        }
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const weeks = useMemo(() => {
    const out: { date: string; n: number }[][] = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 90 - today.getDay());
    for (let w = 0; w < 14; w++) {
      const col: { date: string; n: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + w * 7 + d);
        if (day > today) break;
        const key = day.toISOString().slice(0, 10);
        col.push({ date: key, n: data?.days[key] ?? 0 });
      }
      if (col.length) out.push(col);
    }
    return out;
  }, [data]);

  const maxDay = Math.max(1, ...Object.values(data?.days ?? {}));
  const heat = (n: number) => (n === 0 ? HEAT[0] : HEAT[Math.min(4, 1 + Math.floor((n / maxDay) * 3.99))]);

  const totalLang = data?.langs.reduce((a, l) => a + l.count, 0) ?? 0;

  const Tile = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-line bg-surface/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  );

  return (
    <Section id="github" index="05" title={ui.sectionGithub}>
      <div
        data-spotlight
        className="reveal overflow-hidden rounded-2xl border border-line bg-bg-2/70"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-3">
          <p className="font-mono text-[11px] text-muted">
            $ gh api users/{USER}
          </p>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="font-mono text-[11px] text-acid hover:underline"
          >
            @{USER} →
          </a>
        </div>

        {error && (
          <div className="p-6">
            <p className="text-sm text-muted">
              {en
                ? "GitHub's public API is rate-limited and didn't answer just now — the profile itself is one click away."
                : "GitHub 公开 API 有频率限制，这会儿没响应 —— 直接点上面的链接看主页就行。"}
            </p>
          </div>
        )}

        {!error && (
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.15fr]">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Tile label={en ? "Public repos" : "公开仓库"} value={data ? data.repos : "—"} />
                <Tile label={en ? "Stars earned" : "获得 star"} value={data ? data.stars : "—"} />
                <Tile label={en ? "Followers" : "关注者"} value={data ? data.followers : "—"} />
                <Tile
                  label={en ? "Commits · 90d" : "近 90 天提交"}
                  value={data ? data.pushes : "—"}
                />
              </div>

              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {en ? "Languages by repo" : "各语言仓库数"}
                </p>
                <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
                  {data && totalLang > 0 ? (
                    data.langs.map((l, i) => (
                      <span
                        key={l.name}
                        title={`${l.name} · ${l.count}`}
                        style={{
                          width: `${(l.count / totalLang) * 100}%`,
                          background: LANG_COLORS[i % LANG_COLORS.length],
                        }}
                        className="first:rounded-l-full last:rounded-r-full"
                      />
                    ))
                  ) : (
                    <span className="w-full animate-pulse bg-surface" />
                  )}
                </div>
                <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {(data?.langs ?? []).map((l, i) => (
                    <li key={l.name} className="flex items-center gap-1.5 text-xs text-muted">
                      <span
                        className="size-2 rounded-[2px]"
                        style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                      />
                      <span className="text-fg/80">{l.name}</span>
                      <span className="tabular-nums">{l.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid content-start gap-5">
              <div className="relative">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {en ? "Public push activity · last 90 days" : "公开提交活动 · 近 90 天"}
                </p>
                <div className="flex gap-[3px]">
                  {weeks.map((col, ci) => (
                    <div key={ci} className="grid gap-[3px]">
                      {col.map((cell) => (
                        <button
                          key={cell.date}
                          type="button"
                          aria-label={`${cell.date}: ${cell.n}`}
                          onMouseEnter={(e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            const p = e.currentTarget.offsetParent?.getBoundingClientRect();
                            setHover({
                              date: cell.date,
                              n: cell.n,
                              x: r.left - (p?.left ?? 0) + r.width / 2,
                              y: r.top - (p?.top ?? 0),
                            });
                          }}
                          onMouseLeave={() => setHover(null)}
                          style={{ background: data ? heat(cell.n) : "var(--color-surface)" }}
                          className="size-[13px] rounded-[3px] transition-transform hover:scale-125"
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] text-muted">
                  <span>{en ? "less" : "少"}</span>
                  {HEAT.map((c) => (
                    <span key={c} className="size-[10px] rounded-[2px]" style={{ background: c }} />
                  ))}
                  <span>{en ? "more" : "多"}</span>
                </div>

                {hover && (
                  <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-bg px-2 py-1 font-mono text-[10px] whitespace-nowrap shadow-xl"
                    style={{ left: hover.x, top: hover.y - 6 }}
                  >
                    <span className="text-fg">{hover.n}</span>{" "}
                    <span className="text-muted">{en ? "commits" : "次提交"} · {hover.date}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {en ? "Recently pushed" : "最近推送"}
                </p>
                <ul className="grid gap-1">
                  {(data?.recent ?? []).map((r) => (
                    <li key={r.name}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 font-mono text-xs transition-colors hover:bg-surface"
                      >
                        <span className="truncate text-fg/85">{r.name}</span>
                        <span className="shrink-0 text-muted">{relative(r.at, en)}</span>
                      </a>
                    </li>
                  ))}
                  {!data && !error && (
                    <li className="h-20 animate-pulse rounded-lg bg-surface/60" aria-hidden />
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
