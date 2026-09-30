export type RGB = [number, number, number];
export type Palette = [RGB, RGB, RGB]; // primary, secondary, base

function rgb2hsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function hsl2rgb(h: number, s: number, l: number): RGB {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/** Keep every colour dark and rich enough that white text stays readable on top of it. */
function mood(c: RGB, lo: number, hi: number, sat = 1.15): RGB {
  const [h, s, l] = rgb2hsl(...c);
  return hsl2rgb(h, Math.min(1, s * sat), Math.min(hi, Math.max(lo, l)));
}

export function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Dominant colours from an image: bucket saturated pixels by hue, weight by saturation and
 * mid-lightness, take the two strongest distinct hues, and use the average as the base.
 */
export function extract(img: HTMLImageElement): Palette {
  const w = 24, h = 48;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.drawImage(img, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;

  const BINS = 18;
  const bins = Array.from({ length: BINS }, () => ({ r: 0, g: 0, b: 0, n: 0, score: 0 }));
  let mr = 0, mg = 0, mb = 0;
  const count = d.length / 4;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    mr += r; mg += g; mb += b;
    const [hh, ss, ll] = rgb2hsl(r, g, b);
    if (ss < 0.22 || ll < 0.1 || ll > 0.92) continue;
    const bin = bins[Math.min(BINS - 1, Math.floor(hh * BINS))];
    const wgt = ss * (1 - Math.abs(ll - 0.5));
    bin.r += r * wgt; bin.g += g * wgt; bin.b += b * wgt; bin.n += wgt; bin.score += wgt;
  }
  const mean: RGB = [mr / count, mg / count, mb / count];
  const ranked = bins.map((b, i) => ({ ...b, i })).filter((b) => b.n > 0).sort((a, b) => b.score - a.score);
  const avg = (b: (typeof ranked)[number]): RGB => [b.r / b.n, b.g / b.n, b.b / b.n];

  let primary: RGB = ranked[0] ? avg(ranked[0]) : mean;
  const far = ranked.find((b) => ranked[0] && Math.min(Math.abs(b.i - ranked[0].i), BINS - Math.abs(b.i - ranked[0].i)) >= 2);
  let secondary: RGB;
  if (far) secondary = avg(far);
  else {
    const [hh, ss, ll] = rgb2hsl(...primary);
    secondary = hsl2rgb((hh + 0.09) % 1, ss, ll * 0.8);
  }
  primary = mood(primary, 0.28, 0.5);
  secondary = mood(secondary, 0.22, 0.44);
  const base = mood(mean, 0.07, 0.14, 0.9);
  return [primary, secondary, base];
}

export const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
