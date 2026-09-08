/**
 * Procedurally drawn "app screens" for each project.
 *
 * These are plain SVG strings rather than JSX so the exact same markup can be
 * (a) inlined into the page and (b) rasterised into a WebGL texture for the
 * 3D phone, without maintaining two copies.
 */

const W = 320;
const H = 660;

type Palette = { bg: string; surface: string; line: string; fg: string; muted: string; a: string; b: string };

const P: Record<string, Palette> = {
  savvypiggy: {
    bg: "#0c1310",
    surface: "#15211a",
    line: "#20342a",
    fg: "#ecf7ef",
    muted: "#6f8b7a",
    a: "#8EF07A",
    b: "#34D399",
  },
  dividend: {
    bg: "#0d0c17",
    surface: "#171528",
    line: "#262243",
    fg: "#eeecfa",
    muted: "#7d78a3",
    a: "#A78BFA",
    b: "#60A5FA",
  },
};

const statusBar = (p: Palette) => `
  <rect x="112" y="14" width="96" height="22" rx="11" fill="#000" opacity="0.85"/>
  <rect x="26" y="20" width="26" height="7" rx="3.5" fill="${p.muted}" opacity="0.7"/>
  <rect x="252" y="20" width="18" height="8" rx="2" fill="${p.muted}" opacity="0.7"/>
  <rect x="274" y="21" width="20" height="6" rx="2" fill="${p.muted}" opacity="0.5"/>
`;

const bottomNav = (p: Palette, active = 0) => {
  const xs = [56, 128, 200, 264];
  return `
  <rect x="0" y="${H - 74}" width="${W}" height="74" fill="${p.surface}"/>
  <rect x="0" y="${H - 74}" width="${W}" height="1" fill="${p.line}"/>
  ${xs
    .map(
      (x, i) => `
    <rect x="${x - 11}" y="${H - 52}" width="22" height="22" rx="7" fill="${i === active ? p.a : p.muted}" opacity="${i === active ? 1 : 0.42}"/>
    <rect x="${x - 13}" y="${H - 24}" width="26" height="4" rx="2" fill="${i === active ? p.a : p.muted}" opacity="${i === active ? 0.85 : 0.3}"/>`,
    )
    .join("")}
  `;
};

/* ------------------------------- PetHub -------------------------------- */
/* Redrawn from the actual Compose source: Material 3 light theme, a
   TopAppBar titled "Pet Services", and a LazyColumn of elevated cards
   showing name / description / price. */
const pethub = (() => {
  const bg = "#FEF7FF";
  const surface = "#FFFFFF";
  const primary = "#6650A4";
  const onSurface = "#1D1B20";
  const onSurfaceVar = "#49454F";
  const outline = "#CAC4D0";
  const bar = "#EADDFF";

  const card = (y: number, titleW: number, lines: number[], price: number) => `
    <g>
      <rect x="16" y="${y}" width="288" height="${lines.length === 3 ? 118 : 104}" rx="12" fill="${surface}"/>
      <rect x="16" y="${y}" width="288" height="${lines.length === 3 ? 118 : 104}" rx="12" fill="none" stroke="${outline}" stroke-opacity="0.5"/>
      <rect x="32" y="${y + 18}" width="${titleW}" height="12" rx="6" fill="${onSurface}" opacity="0.88"/>
      ${lines
        .map((w, i) => `<rect x="32" y="${y + 42 + i * 15}" width="${w}" height="7" rx="3.5" fill="${onSurfaceVar}" opacity="0.6"/>`)
        .join("")}
      <rect x="32" y="${y + (lines.length === 3 ? 94 : 80)}" width="${price}" height="9" rx="4.5" fill="${primary}"/>
    </g>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>

  <rect x="112" y="12" width="96" height="20" rx="10" fill="#000" opacity="0.12"/>
  <rect x="24" y="18" width="26" height="6" rx="3" fill="${onSurfaceVar}" opacity="0.55"/>
  <rect x="252" y="18" width="18" height="7" rx="2" fill="${onSurfaceVar}" opacity="0.55"/>
  <rect x="276" y="19" width="20" height="5" rx="2" fill="${onSurfaceVar}" opacity="0.4"/>

  <rect x="0" y="44" width="${W}" height="60" fill="${bar}"/>
  <rect x="20" y="66" width="118" height="15" rx="7.5" fill="${onSurface}" opacity="0.82"/>

  ${card(120, 96, [252, 214], 44)}
  ${card(254, 112, [248, 236, 168], 44)}
  ${card(402, 86, [244, 190], 44)}
  ${card(526, 152, [250, 198], 44)}

  <rect x="0" y="${H - 26}" width="${W}" height="26" fill="${bg}"/>
  <rect x="118" y="${H - 14}" width="84" height="4" rx="2" fill="${onSurface}" opacity="0.35"/>
</svg>`;
})();

/* ----------------------------- SavvyPiggy ------------------------------ */
const savvypiggy = (() => {
  const p = P.savvypiggy;
  const donut = (cx: number, cy: number, r: number) => {
    const segs = [
      { v: 0.42, c: p.a },
      { v: 0.26, c: p.b },
      { v: 0.18, c: "#F59E0B" },
      { v: 0.14, c: p.line },
    ];
    let acc = -Math.PI / 2;
    return segs
      .map((s) => {
        const a0 = acc;
        const a1 = acc + s.v * Math.PI * 2;
        acc = a1;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${s.c}" stroke-width="16" stroke-linecap="round"/>`;
      })
      .join("");
  };

  const row = (y: number, w: number, pct: number, c: string) => `
    <rect x="20" y="${y}" width="280" height="52" rx="14" fill="${p.surface}" stroke="${p.line}"/>
    <rect x="32" y="${y + 14}" width="24" height="24" rx="8" fill="${c}" opacity="0.22"/>
    <circle cx="44" cy="${y + 26}" r="6" fill="${c}"/>
    <rect x="68" y="${y + 16}" width="${w}" height="7" rx="3.5" fill="${p.fg}" opacity="0.85"/>
    <rect x="68" y="${y + 31}" width="${Math.round(w * 0.55)}" height="5" rx="2.5" fill="${p.muted}" opacity="0.6"/>
    <rect x="${288 - 44}" y="${y + 20}" width="44" height="7" rx="3.5" fill="${c}" opacity="0.9"/>
    <rect x="68" y="${y + 42}" width="200" height="3" rx="1.5" fill="${p.line}"/>
    <rect x="68" y="${y + 42}" width="${Math.round(200 * pct)}" height="3" rx="1.5" fill="${c}"/>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sp-card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.a}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${p.b}" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  ${statusBar(p)}
  <rect x="20" y="56" width="74" height="7" rx="3.5" fill="${p.muted}" opacity="0.75"/>
  <rect x="20" y="72" width="118" height="13" rx="6.5" fill="${p.fg}" opacity="0.92"/>
  <circle cx="282" cy="72" r="17" fill="${p.surface}" stroke="${p.line}"/>
  <rect x="275" y="65" width="14" height="3" rx="1.5" fill="${p.muted}"/>
  <rect x="275" y="71" width="14" height="3" rx="1.5" fill="${p.muted}"/>
  <rect x="275" y="77" width="14" height="3" rx="1.5" fill="${p.muted}"/>

  <rect x="20" y="104" width="280" height="132" rx="22" fill="url(#sp-card)"/>
  <rect x="40" y="126" width="72" height="6" rx="3" fill="#0a140e" opacity="0.6"/>
  <rect x="40" y="144" width="152" height="20" rx="10" fill="#0a140e" opacity="0.88"/>
  <rect x="40" y="176" width="54" height="5" rx="2.5" fill="#0a140e" opacity="0.5"/>
  <rect x="40" y="192" width="110" height="26" rx="13" fill="#0a140e" opacity="0.85"/>
  <rect x="56" y="203" width="78" height="4" rx="2" fill="${p.a}"/>
  <circle cx="252" cy="140" r="26" fill="#0a140e" opacity="0.16"/>
  <path d="M240 148c0-9 6-15 14-15s14 6 14 15-6 13-14 13-14-4-14-13z" fill="#0a140e" opacity="0.5"/>
  <circle cx="248" cy="142" r="2.4" fill="${p.a}"/>
  <rect x="256" y="128" width="12" height="6" rx="3" fill="#0a140e" opacity="0.5"/>

  <rect x="20" y="254" width="280" height="150" rx="20" fill="${p.surface}" stroke="${p.line}"/>
  <rect x="38" y="272" width="88" height="8" rx="4" fill="${p.fg}" opacity="0.8"/>
  ${donut(96, 340, 42)}
  <rect x="86" y="334" width="22" height="7" rx="3.5" fill="${p.fg}" opacity="0.85"/>
  <rect x="82" y="346" width="30" height="4" rx="2" fill="${p.muted}" opacity="0.7"/>
  ${[
    { c: p.a, y: 302 },
    { c: p.b, y: 326 },
    { c: "#F59E0B", y: 350 },
    { c: p.line, y: 374 },
  ]
    .map(
      (s) => `
    <circle cx="176" cy="${s.y}" r="4.5" fill="${s.c}"/>
    <rect x="188" y="${s.y - 3.5}" width="${58 + (s.y % 3) * 8}" height="7" rx="3.5" fill="${p.fg}" opacity="0.55"/>`,
    )
    .join("")}

  ${row(420, 78, 0.72, p.a)}
  ${row(482, 62, 0.44, p.b)}
  ${bottomNav(p, 1)}
</svg>`;
})();

/* --------------------------- Dividend-Tracker -------------------------- */
const dividend = (() => {
  const p = P.dividend;

  const pts = [0, 12, 8, 26, 20, 40, 34, 52, 46, 66, 74, 92];
  const chartW = 244;
  const chartH = 108;
  const max = Math.max(...pts);
  const path = pts
    .map((v, i) => {
      const x = 38 + (i / (pts.length - 1)) * chartW;
      const y = 300 - (v / max) * chartH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${(38 + chartW).toFixed(1)} 300 L38 300 Z`;

  const ticker = (y: number, w: number, up: boolean, pct: number) => `
    <rect x="20" y="${y}" width="280" height="58" rx="16" fill="${p.surface}" stroke="${p.line}"/>
    <rect x="32" y="${y + 15}" width="28" height="28" rx="9" fill="${up ? p.a : "#F87171"}" opacity="0.2"/>
    <rect x="40" y="${y + 24}" width="12" height="10" rx="2" fill="${up ? p.a : "#F87171"}"/>
    <rect x="72" y="${y + 17}" width="${w}" height="8" rx="4" fill="${p.fg}" opacity="0.88"/>
    <rect x="72" y="${y + 33}" width="${Math.round(w * 0.7)}" height="6" rx="3" fill="${p.muted}" opacity="0.6"/>
    <rect x="${288 - 56}" y="${y + 16}" width="56" height="8" rx="4" fill="${p.fg}" opacity="0.8"/>
    <rect x="${288 - 40}" y="${y + 32}" width="40" height="16" rx="8" fill="${up ? p.a : "#F87171"}" opacity="0.18"/>
    <rect x="${288 - 32}" y="${y + 38}" width="24" height="4" rx="2" fill="${up ? p.a : "#F87171"}"/>
    <path d="M${288 - 78} ${y + 40} l${Math.round(pct * 6)} -8 l6 4 l8 -10" fill="none" stroke="${up ? p.a : "#F87171"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="dv-area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.a}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${p.a}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="dv-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${p.b}"/>
      <stop offset="1" stop-color="${p.a}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  ${statusBar(p)}
  <rect x="20" y="56" width="94" height="7" rx="3.5" fill="${p.muted}" opacity="0.75"/>
  <rect x="20" y="72" width="140" height="20" rx="10" fill="${p.fg}" opacity="0.92"/>
  <rect x="20" y="102" width="46" height="18" rx="9" fill="${p.a}" opacity="0.18"/>
  <rect x="28" y="108" width="30" height="5" rx="2.5" fill="${p.a}"/>
  <rect x="74" y="106" width="70" height="6" rx="3" fill="${p.muted}" opacity="0.6"/>
  <circle cx="282" cy="76" r="17" fill="${p.surface}" stroke="${p.line}"/>
  <circle cx="282" cy="76" r="6" fill="none" stroke="${p.muted}" stroke-width="2"/>
  <path d="M282 66v4M282 82v4M272 76h4M288 76h4" stroke="${p.muted}" stroke-width="2" stroke-linecap="round"/>

  <rect x="20" y="140" width="280" height="196" rx="20" fill="${p.surface}" stroke="${p.line}"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="38" y="${196 + i * 34}" width="244" height="1" fill="${p.line}" opacity="0.7"/>`).join("")}
  <path d="${area}" fill="url(#dv-area)"/>
  <path d="${path}" fill="none" stroke="url(#dv-line)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="282" cy="192" r="5" fill="${p.a}"/>
  <circle cx="282" cy="192" r="10" fill="${p.a}" opacity="0.25"/>
  ${["1D", "1W", "1M", "1Y"]
    .map(
      (_, i) => `
    <rect x="${38 + i * 62}" y="312" width="52" height="20" rx="10" fill="${i === 2 ? p.a : "transparent"}" opacity="${i === 2 ? 0.9 : 1}"/>
    <rect x="${52 + i * 62}" y="320" width="24" height="4" rx="2" fill="${i === 2 ? p.bg : p.muted}" opacity="${i === 2 ? 0.9 : 0.55}"/>`,
    )
    .join("")}

  <rect x="20" y="354" width="104" height="8" rx="4" fill="${p.fg}" opacity="0.8"/>
  ${ticker(376, 62, true, 4)}
  ${ticker(444, 78, true, 3)}
  ${ticker(512, 54, false, 2)}
  ${bottomNav(p, 2)}
</svg>`;
})();

export const projectArt: Record<string, string> = {
  pethub,
  savvypiggy,
  dividend,
};

/**
 * Real screenshots of the shipped apps, with every figure swapped for demo
 * data. These mirror the app's actual structure: one entry per bottom-nav
 * tab, and `parts` are that same page scrolled further down — not separate
 * screens.
 */
export type AppScreen = { tab: string; parts: string[] };

export const projectScreens: Record<string, AppScreen[]> = {
  savvypiggy: [
    { tab: "Home", parts: ["./savvypiggy-home.jpg"] },
    { tab: "History", parts: ["./savvypiggy-history.jpg"] },
    { tab: "Strategy", parts: ["./savvypiggy-strategy.jpg", "./savvypiggy-goals.jpg"] },
    {
      tab: "Report",
      parts: [
        "./savvypiggy-report.jpg",
        "./savvypiggy-alloc.jpg",
        "./savvypiggy-pacing.jpg",
      ],
    },
  ],
  dividend: [{ tab: "Home", parts: ["./dividend-home.jpg"] }],
};

export function screenSrc(key: string, tab = 0, part = 0): string | null {
  const screens = projectScreens[key];
  if (!screens || !screens.length) return null;
  const s = screens[Math.min(tab, screens.length - 1)];
  return s.parts[Math.min(part, s.parts.length - 1)] ?? null;
}

export function allShots(key: string): string[] {
  return (projectScreens[key] ?? []).flatMap((s) => s.parts);
}

export const artAccent: Record<string, string> = {
  pethub: "#8A6FD1",
  savvypiggy: P.savvypiggy.a,
  dividend: P.dividend.a,
};
