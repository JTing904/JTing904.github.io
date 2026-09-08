# jting904.github.io

Personal site for **Tan Keng Ting (EdwardJT)** — a portfolio you can actually play.

Live: https://jting904.github.io

## What's in it

- **Play mode** — a boot-up terminal you can type commands into (`help`, `projects`, `play`, `hire`…), an RPG-style skill tree, project cards as quests, and a journey timeline whose spine draws itself as you scroll.
- **Recruiter mode** — one toggle switches the whole site into a clean, scannable résumé that prints straight to PDF (⌘/Ctrl + P).
- **⌘K command palette** — fuzzy search over every section, action and repo.
- **Run My Code** — real logic lifted out of my projects, editable and executable in a sandboxed Web Worker with a 2-second watchdog.
- **Live from GitHub** — repos, stars, language split and a 90-day push heatmap, fetched from the public GitHub API in your browser. The categorical palette is validated for colour-vision deficiency separation and 3:1 contrast.
- **3D phone showcase** — plain three.js, dynamically imported only when the projects section approaches the viewport; drag to rotate.
- **WebGL aurora** — a hand-written fragment shader (domain-warped value noise) behind the hero, capped at 40fps and paused off-screen.
- **Deploy Run** — a canvas endless runner. Jump the bugs, reach 100 to unlock an achievement.
- **Twelve achievements**, a magnetic cursor, pointer-tracking card spotlights, and a Konami code.
- **Bilingual** — English / 中文, switched with the View Transitions API.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config, `oklch()` colours) |
| Motion | Motion (Framer Motion) + native CSS scroll-driven animations |
| 3D | three.js, lazily imported |
| Fonts | Geist Sans / Geist Mono, self-hosted |
| Hosting | GitHub Pages via GitHub Actions |

Modern platform features used on purpose: `@view-transition`, `animation-timeline: view()` and `scroll()`, `color-mix()`, `oklch()`, `text-wrap: balance`, WebGL2 shaders, `CanvasTexture`, Web Workers, and `IntersectionObserver`-gated render loops so nothing animates off-screen.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
```

## Editing content

Everything you'd want to change — bio, skills, projects, timeline, both languages — lives in a single file:

```
src/lib/content.ts
```

Push to `main` and GitHub Actions rebuilds and redeploys the site.
