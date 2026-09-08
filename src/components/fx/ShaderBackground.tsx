"use client";

import { useEffect, useRef } from "react";

/**
 * Hand-written WebGL background: layered simplex-ish noise warped into a
 * slow-moving aurora, nudged by the pointer. No library — one program,
 * one full-screen triangle, ~1 draw call per frame.
 *
 * Degrades to the CSS gradient behind it if WebGL is unavailable, and
 * stops entirely for `prefers-reduced-motion` or when the tab is hidden.
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uIntensity;

// --- value noise -----------------------------------------------------------
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 st = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;

  float t = uTime * 0.045;
  vec2 m = (uMouse - 0.5) * 0.6;

  // domain warping — noise fed into noise
  vec2 q = vec2(fbm(st * 1.6 + vec2(0.0, t)), fbm(st * 1.6 + vec2(4.3, -t)));
  vec2 r = vec2(
    fbm(st * 1.9 + 3.4 * q + vec2(1.7, 9.2) + t * 1.4 + m),
    fbm(st * 1.9 + 3.4 * q + vec2(8.3, 2.8) - t * 1.1 - m)
  );
  float f = fbm(st * 1.7 + 3.2 * r);

  // palette — deep indigo base, acid green + violet highlights
  vec3 base   = vec3(0.043, 0.055, 0.098);
  vec3 acid   = vec3(0.443, 0.925, 0.510);
  vec3 violet = vec3(0.596, 0.400, 0.965);
  vec3 blue   = vec3(0.180, 0.360, 0.780);

  vec3 col = base;
  col = mix(col, blue,   clamp(f * f * 0.85, 0.0, 1.0));
  col = mix(col, violet, clamp(length(q) * 0.30, 0.0, 1.0));
  col = mix(col, acid,   clamp(r.x * 0.20, 0.0, 1.0));
  col *= 0.72;

  // pointer glow
  float d = length(st - vec2(m.x * 1.6, -m.y * 1.6));
  col += acid * 0.055 * exp(-d * 3.4);

  // vignette + top-weighted fade so content stays readable
  col *= smoothstep(1.05, 0.05, length(st * vec2(0.8, 1.05)));
  col *= mix(1.0, 0.12, smoothstep(0.1, 0.85, uv.y));

  // subtle film grain kills banding
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.018;

  fragColor = vec4(col * uIntensity, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // render at reduced resolution — it's a soft gradient, nobody counts pixels
      const scale = w > 1200 ? 0.55 : 0.7;
      canvas.width = Math.max(1, Math.round(w * dpr * scale));
      canvas.height = Math.max(1, Math.round(h * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = true;
    const t0 = performance.now();
    let lastDraw = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      // cap at ~40fps — this is background texture, not a game
      if (now - lastDraw < 25) return;
      lastDraw = now;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntensity, 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && document.visibilityState === "visible";
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      void dpr;
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
