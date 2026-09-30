# jting904.github.io

Personal site of Tan Keng Ting. Next.js (static export), GSAP + ScrollTrigger, Lenis, Mona Sans.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

The work carousel is hand-written: cards are placed in 3D by their distance from the centre, and
the background is painted from colours pulled out of each screenshot (`src/lib/palette.ts`,
pre-computed into `src/lib/palettes.json`).
