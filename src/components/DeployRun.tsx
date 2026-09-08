"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ui } from "@/lib/content";
import { useStore } from "@/lib/store";
import Section from "./Section";

type Phase = "idle" | "playing" | "over";

type Obstacle = { x: number; y: number; w: number; h: number; flying: boolean };

const GROUND_PAD = 34;
const GRAVITY = 2400;
const JUMP_V = -720;
const HOLD_BOOST = -1500;
const BEST_KEY = "ejt.deployrun.best";

const C = {
  ground: "#3c4459",
  player: "#8ef07a",
  playerDark: "#0f1320",
  bug: "#ff6b6b",
  bugDark: "#7a2530",
  dust: "#4b5570",
  star: "#5a6480",
};

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
function writeBest(v: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(v));
  } catch {
    /* storage may be blocked */
  }
}

export default function DeployRun() {
  const { lang, unlock } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const g = useRef({
    phase: "idle" as Phase,
    t: 0,
    speed: 300,
    dist: 0,
    py: 0,
    vy: 0,
    grounded: true,
    holding: false,
    holdTime: 0,
    obstacles: [] as Obstacle[],
    stars: [] as { x: number; y: number; r: number; s: number }[],
    dust: [] as { x: number; y: number; vx: number; vy: number; life: number }[],
    nextSpawn: 0.9,
    w: 0,
    h: 0,
    visible: true,
  });

  useEffect(() => setBest(readBest()), []);

  const reset = useCallback(() => {
    const s = g.current;
    s.t = 0;
    s.speed = 320;
    s.dist = 0;
    s.py = 0;
    s.vy = 0;
    s.grounded = true;
    s.obstacles = [];
    s.dust = [];
    s.nextSpawn = 0.9;
    setScore(0);
  }, []);

  const start = useCallback(() => {
    reset();
    g.current.phase = "playing";
    setPhase("playing");
    unlock("runner");
  }, [reset, unlock]);

  const jump = useCallback(() => {
    const s = g.current;
    if (s.phase === "idle" || s.phase === "over") {
      start();
      return;
    }
    if (s.grounded) {
      s.vy = JUMP_V;
      s.grounded = false;
      s.holding = true;
      s.holdTime = 0;
      for (let i = 0; i < 8; i++) {
        s.dust.push({
          x: 56,
          y: s.h - GROUND_PAD,
          vx: -60 - Math.random() * 120,
          vy: -Math.random() * 90,
          life: 0.45,
        });
      }
    }
  }, [start]);

  // ---- main loop ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    const s = g.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      s.w = rect.width;
      s.h = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!s.stars.length) {
        for (let i = 0; i < 26; i++) {
          s.stars.push({
            x: Math.random() * rect.width,
            y: Math.random() * (rect.height - GROUND_PAD - 20) + 8,
            r: Math.random() * 1.4 + 0.4,
            s: Math.random() * 0.5 + 0.2,
          });
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => {
        s.visible = e.isIntersecting;
      },
      { threshold: 0.15 },
    );
    io.observe(wrap);

    const spawn = () => {
      const flying = s.dist > 55 && Math.random() < 0.28;
      const w = 14 + Math.random() * 16;
      const h = flying ? 16 : 18 + Math.random() * 20;
      s.obstacles.push({
        x: s.w + 20,
        y: flying ? s.h - GROUND_PAD - 62 : s.h - GROUND_PAD - h,
        w,
        h,
        flying,
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!s.visible) return;

      const groundY = s.h - GROUND_PAD;
      const playing = s.phase === "playing";

      // ---------- update ----------
      if (playing) {
        s.t += dt;
        s.speed = 320 + Math.min(s.t * 14, 300);
        s.dist += (s.speed * dt) / 40;
        const int = Math.floor(s.dist);
        setScore((prev) => (prev === int ? prev : int));

        if (s.holding && s.holdTime < 0.16) {
          s.vy += HOLD_BOOST * dt;
          s.holdTime += dt;
        }
        s.vy += GRAVITY * dt;
        s.py += s.vy * dt;
        if (s.py > 0) {
          s.py = 0;
          s.vy = 0;
          s.grounded = true;
        }

        s.nextSpawn -= dt;
        if (s.nextSpawn <= 0) {
          spawn();
          s.nextSpawn = Math.max(0.52, 1.3 - s.t * 0.02) + Math.random() * 0.55;
        }

        for (const o of s.obstacles) o.x -= s.speed * dt;
        s.obstacles = s.obstacles.filter((o) => o.x + o.w > -30);

        // collision
        const px = 44;
        const pw = 26;
        const ph = 26;
        const pyTop = groundY - ph + s.py;
        for (const o of s.obstacles) {
          if (
            px + pw - 4 > o.x &&
            px + 4 < o.x + o.w &&
            pyTop + ph - 3 > o.y &&
            pyTop + 3 < o.y + o.h
          ) {
            s.phase = "over";
            setPhase("over");
            const finalScore = Math.floor(s.dist);
            if (finalScore >= 100) unlock("shipped");
            setBest((b) => {
              if (finalScore > b) {
                writeBest(finalScore);
                return finalScore;
              }
              return b;
            });
            break;
          }
        }
      }

      for (const st of s.stars) {
        st.x -= (playing ? s.speed : 40) * st.s * dt;
        if (st.x < -2) st.x = s.w + 2;
      }
      for (const d of s.dust) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 400 * dt;
        d.life -= dt;
      }
      s.dust = s.dust.filter((d) => d.life > 0);

      // ---------- draw ----------
      ctx.clearRect(0, 0, s.w, s.h);

      ctx.fillStyle = C.star;
      for (const st of s.stars) {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = C.ground;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 1);
      ctx.lineTo(s.w, groundY + 1);
      ctx.stroke();

      // ground ticks
      ctx.globalAlpha = 0.6;
      const off = (s.dist * 8) % 40;
      for (let x = -off; x < s.w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 6);
        ctx.lineTo(x + 12, groundY + 6);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = C.dust;
      for (const d of s.dust) {
        ctx.globalAlpha = Math.max(d.life / 0.45, 0);
        ctx.fillRect(d.x, d.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;

      // obstacles — little bugs
      for (const o of s.obstacles) {
        ctx.fillStyle = C.bug;
        roundRect(ctx, o.x, o.y, o.w, o.h, 4);
        ctx.fill();
        ctx.fillStyle = C.bugDark;
        ctx.fillRect(o.x + 3, o.y + 4, o.w - 6, 2);
        if (o.flying) {
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = C.bug;
          const flap = Math.sin(s.t * 26) * 4;
          ctx.fillRect(o.x - 6, o.y + 2 + flap, 6, 3);
          ctx.fillRect(o.x + o.w, o.y + 2 - flap, 6, 3);
          ctx.globalAlpha = 1;
        }
      }

      // player
      const px = 44;
      const ph = 26;
      const pyTop = groundY - ph + s.py;
      ctx.fillStyle = C.player;
      roundRect(ctx, px, pyTop, 26, ph, 6);
      ctx.fill();
      ctx.fillStyle = C.playerDark;
      ctx.font = "bold 13px ui-monospace, monospace";
      ctx.textBaseline = "middle";
      ctx.fillText(">_", px + 5, pyTop + ph / 2 + 1);

      if (!playing) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = C.ground;
        ctx.fillRect(0, 0, s.w, s.h);
        ctx.globalAlpha = 1;
      }
    };

    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        if (!s.visible) return;
        e.preventDefault();
        jump();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") s.holding = false;
    };
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [jump, unlock]);

  const en = lang === "en";

  return (
    <Section id="play" index="07" title={ui.sectionPlay}>
      <div className="reveal overflow-hidden rounded-2xl border border-line bg-bg-2/70">
        <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5 font-mono text-[11px]">
          <span className="text-muted">
            {en ? "jump the bugs · space / tap" : "跳过 bug · 空格 / 点击"}
          </span>
          <span className="flex gap-4">
            <span className="text-acid">
              {en ? "SCORE" : "分数"} {String(score).padStart(4, "0")}
            </span>
            <span className="text-muted">
              {en ? "BEST" : "最高"} {String(best).padStart(4, "0")}
            </span>
          </span>
        </div>

        <div
          ref={wrapRef}
          onPointerDown={(e) => {
            e.preventDefault();
            jump();
          }}
          onPointerUp={() => {
            g.current.holding = false;
          }}
          role="button"
          tabIndex={0}
          aria-label={en ? "Deploy Run mini game" : "上线冲刺小游戏"}
          onKeyDown={(e) => {
            if (e.key === "Enter") jump();
          }}
          className="relative h-[240px] w-full cursor-pointer touch-none select-none sm:h-[280px]"
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {phase !== "playing" && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <div>
                {phase === "over" && (
                  <p className="mb-1 font-mono text-xs text-danger">
                    {en ? "BUILD FAILED" : "构建失败"} · {score}
                  </p>
                )}
                <p className="text-lg font-semibold tracking-tight">
                  {phase === "over"
                    ? en
                      ? "Try again?"
                      : "再来一次？"
                    : en
                      ? "Deploy Run"
                      : "上线冲刺"}
                </p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {en
                    ? "Reach 100 to unlock an achievement"
                    : "跑到 100 分解锁一个成就"}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    start();
                  }}
                  className="mt-4 rounded-lg bg-acid px-5 py-2 font-mono text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
                >
                  {phase === "over" ? (en ? "Redeploy" : "重新部署") : en ? "Start" : "开始"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
