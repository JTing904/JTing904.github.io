"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ui, type L } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

/**
 * A real JavaScript sandbox. Code runs in a Web Worker built from a blob, so
 * it has no DOM, no cookies and no access to this page; a watchdog terminates
 * anything that runs longer than two seconds.
 */

const WORKER_SRC = `
self.onmessage = function (e) {
  var logs = [];
  function fmt(v) {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.name + ": " + v.message;
    try { return JSON.stringify(v, null, 2); } catch (_) { return String(v); }
  }
  function push() {
    logs.push(Array.prototype.map.call(arguments, fmt).join(" "));
    if (logs.length > 200) { throw new Error("too much output"); }
  }
  var sandboxConsole = { log: push, info: push, warn: push, error: push, debug: push };
  try {
    var fn = new Function("console", '"use strict";\\n' + e.data);
    var ret = fn(sandboxConsole);
    if (ret !== undefined) push(ret);
    self.postMessage({ ok: true, logs: logs });
  } catch (err) {
    self.postMessage({ ok: false, logs: logs, error: (err && err.message) ? err.name + ": " + err.message : String(err) });
  }
};
`;

type Snippet = { id: string; title: L; note: L; code: string };

const SNIPPETS: Snippet[] = [
  {
    id: "piggy",
    title: { en: "SavvyPiggy — deposit rule", zh: "SavvyPiggy — 存入规则" },
    note: {
      en: "The rule the whole app is built on: a deposit clears debt before any of it reaches a goal.",
      zh: "整个 App 的核心规则：存入的钱先还清欠款，剩下的才进目标。",
    },
    code: `// A deposit settles what you owe first, then fills the piggy banks.
function deposit(amount, debts, banks) {
  let left = amount;

  for (const d of debts) {
    const pay = Math.min(left, d.owed);
    d.owed -= pay;
    left -= pay;
  }

  // whatever survives is split by each bank's remaining need
  const need = banks.map(b => Math.max(0, b.goal - b.saved));
  const total = need.reduce((a, b) => a + b, 0);

  banks.forEach((b, i) => {
    if (!total) return;
    b.saved += (need[i] / total) * left;
  });

  return { banks, debts, unallocated: total ? 0 : left };
}

const debts = [{ owed: 2.5 }, { owed: 6.0 }];
const banks = [
  { name: "Emergency", goal: 1000, saved: 820 },
  { name: "New laptop", goal: 3500, saved: 640 },
];

const out = deposit(50, debts, banks);
console.log("debt left:", out.debts.map(d => d.owed.toFixed(2)).join(", "));
out.banks.forEach(b =>
  console.log(b.name, "→", b.saved.toFixed(2), "/", b.goal)
);`,
  },
  {
    id: "dividend",
    title: { en: "Dividend-Tracker — yield", zh: "Dividend-Tracker — 股息" },
    note: {
      en: "Annual income and yield on cost, the two numbers the app exists to show.",
      zh: "年化收入和成本收益率 —— App 存在的意义就是显示这两个数。",
    },
    code: `const holdings = [
  { ticker: "MAYBANK", shares: 400, price: 9.80, cost: 8.55, dpsPerYear: 0.60 },
  { ticker: "TENAGA",  shares: 150, price: 13.40, cost: 12.10, dpsPerYear: 0.51 },
  { ticker: "PBBANK",  shares: 900, price: 4.32, cost: 4.05, dpsPerYear: 0.19 },
];

let income = 0, cost = 0, value = 0;

for (const h of holdings) {
  const annual = h.shares * h.dpsPerYear;
  income += annual;
  cost   += h.shares * h.cost;
  value  += h.shares * h.price;
  console.log(
    h.ticker.padEnd(9),
    "RM" + annual.toFixed(2).padStart(8),
    "yield on cost " + ((h.dpsPerYear / h.cost) * 100).toFixed(2) + "%"
  );
}

console.log("-".repeat(44));
console.log("annual income  RM" + income.toFixed(2));
console.log("yield on cost  " + ((income / cost) * 100).toFixed(2) + "%");
console.log("portfolio      RM" + value.toFixed(2));`,
  },
  {
    id: "dsa",
    title: { en: "DSA — group anagrams", zh: "数据结构 — 变位词分组" },
    note: {
      en: "Hash-map bucketing, O(n·k log k). The kind of thing my diploma drilled.",
      zh: "哈希桶分组，O(n·k log k)。文凭阶段练到吐的那类题。",
    },
    code: `function groupAnagrams(words) {
  const buckets = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(w);
  }
  return [...buckets.values()];
}

const input = ["eat", "tea", "tan", "ate", "nat", "bat"];
for (const group of groupAnagrams(input)) {
  console.log(group.join(", "));
}`,
  },
];

const TOKEN =
  /(\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|\b(const|let|var|function|return|if|else|for|of|in|while|new|class|extends|try|catch|throw|typeof|instanceof|await|async|export|import|from|null|undefined|true|false)\b/g;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Single-pass tokeniser — chained replaces would re-match the markup they emit. */
function highlight(code: string) {
  let out = "";
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    out += esc(code.slice(last, at));
    const cls = m[1] ? "tok-c" : m[2] ? "tok-s" : m[3] ? "tok-n" : "tok-k";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = at + m[0].length;
  }
  return out + esc(code.slice(last));
}

export default function Playground() {
  const { lang, unlock } = useStore();
  const en = lang === "en";
  const [snippet, setSnippet] = useState(SNIPPETS[0]);
  const [code, setCode] = useState(SNIPPETS[0].code);
  const [out, setOut] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    const blob = new Blob([WORKER_SRC], { type: "text/javascript" });
    urlRef.current = URL.createObjectURL(blob);
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const run = useCallback(() => {
    if (!urlRef.current || running) return;
    setRunning(true);
    setErr(null);
    setOut([]);
    unlock("hacker");

    const worker = new Worker(urlRef.current);
    const timer = window.setTimeout(() => {
      worker.terminate();
      setRunning(false);
      setErr(en ? "Timed out after 2s — infinite loop?" : "2 秒超时 —— 是不是死循环了？");
    }, 2000);

    worker.onmessage = (e: MessageEvent) => {
      window.clearTimeout(timer);
      const d = e.data as { ok: boolean; logs: string[]; error?: string };
      setOut(d.logs);
      if (!d.ok) setErr(d.error ?? "Error");
      setRunning(false);
      worker.terminate();
    };
    worker.onerror = () => {
      window.clearTimeout(timer);
      setRunning(false);
      setErr(en ? "Worker failed to start." : "Worker 启动失败。");
      worker.terminate();
    };
    worker.postMessage(code);
  }, [code, en, running, unlock]);

  const pick = (s: Snippet) => {
    setSnippet(s);
    setCode(s.code);
    setOut([]);
    setErr(null);
  };

  return (
    <Section id="code" index="06" title={ui.sectionPlayground}>
      <p className="reveal mb-5 max-w-2xl text-pretty text-sm text-muted">
        {en
          ? "Actual logic from my projects, running in your browser. Edit it, break it, run it again — it executes in a sandboxed Web Worker with a 2-second leash."
          : "我项目里的真实逻辑，直接在你浏览器里跑。随便改、随便弄坏、再跑一次 —— 它在沙箱 Web Worker 里执行，2 秒强制超时。"}
      </p>

      <div className="reveal mb-4 flex flex-wrap gap-2">
        {SNIPPETS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s)}
            data-magnetic
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
              snippet.id === s.id
                ? "border-acid bg-acid/10 text-acid"
                : "border-line text-muted hover:text-fg"
            }`}
          >
            {s.title[lang]}
          </button>
        ))}
      </div>

      <p className="reveal mb-4 font-mono text-xs text-muted/80">{snippet.note[lang]}</p>

      <div className="reveal grid gap-4 lg:grid-cols-2">
        <div
          data-spotlight
          className="relative overflow-hidden rounded-2xl border border-line bg-bg-2/80"
        >
          <div className="flex items-center justify-between border-b border-line/70 px-4 py-2">
            <span className="font-mono text-[11px] text-muted">sandbox.js</span>
            <button
              type="button"
              onClick={run}
              disabled={running}
              data-magnetic
              className="rounded-md bg-acid px-3 py-1 font-mono text-[11px] font-semibold text-bg disabled:opacity-50"
            >
              {running ? (en ? "running…" : "运行中…") : `▸ ${en ? "Run" : "运行"}`}
            </button>
          </div>

          <div className="relative h-[340px] overflow-hidden">
            <pre
              ref={preRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre p-4 font-mono text-[12.5px] leading-[1.55]"
              dangerouslySetInnerHTML={{ __html: highlight(code) + "\n" }}
            />
            <textarea
              ref={taRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={() => {
                if (preRef.current && taRef.current) {
                  preRef.current.scrollTop = taRef.current.scrollTop;
                  preRef.current.scrollLeft = taRef.current.scrollLeft;
                }
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  run();
                }
                if (e.key === "Tab") {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const s = el.selectionStart;
                  setCode(code.slice(0, s) + "  " + code.slice(el.selectionEnd));
                  requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
                }
              }}
              spellCheck={false}
              aria-label={en ? "Editable code" : "可编辑代码"}
              className="thin-scroll absolute inset-0 resize-none overflow-auto whitespace-pre bg-transparent p-4 font-mono text-[12.5px] leading-[1.55] text-transparent caret-acid outline-none"
            />
          </div>
          <p className="border-t border-line/70 px-4 py-2 font-mono text-[10px] text-muted">
            ⌘/Ctrl + Enter {en ? "to run" : "运行"}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-bg-2/80">
          <div className="border-b border-line/70 px-4 py-2 font-mono text-[11px] text-muted">
            {en ? "output" : "输出"}
          </div>
          <div className="thin-scroll h-[340px] overflow-auto p-4 font-mono text-[12.5px] leading-[1.55]">
            {out.length === 0 && !err && (
              <p className="text-muted/60">
                {en ? "// press Run" : "// 点运行"}
              </p>
            )}
            {out.map((l, i) => (
              <p key={i} className="whitespace-pre-wrap text-fg/85">
                {l}
              </p>
            ))}
            {err && <p className="mt-2 whitespace-pre-wrap text-danger">{err}</p>}
          </div>
        </div>
      </div>
    </Section>
  );
}
