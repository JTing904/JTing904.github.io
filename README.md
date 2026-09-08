# jting904.github.io

Personal site for **Tan Keng Ting (EdwardJT)** — a portfolio you can actually play.

Live: https://jting904.github.io

## What's in it

- **Play mode** — a boot-up terminal you can type commands into (`help`, `projects`, `play`, `hire`…), an RPG-style skill tree, project cards as quests, and a scrollable journey timeline.
- **Recruiter mode** — one toggle switches the whole site into a clean, scannable résumé that prints straight to PDF (⌘/Ctrl + P).
- **Deploy Run** — a small canvas endless runner. Jump the bugs, reach 100 to unlock an achievement. High score is kept in `localStorage`.
- **Achievements** — ten of them, unlocked by exploring. There's a Konami code in here somewhere.
- **Bilingual** — English / 中文, switched with the View Transitions API.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config, `oklch()` colours) |
| Motion | Motion (Framer Motion) + native CSS scroll-driven animations |
| Fonts | Geist Sans / Geist Mono, self-hosted |
| Hosting | GitHub Pages via GitHub Actions |

Modern platform features used on purpose: `@view-transition`, `animation-timeline: view()` and `scroll()`, `color-mix()`, `oklch()`, `text-wrap: balance`, container-free responsive layout, and a `<canvas>` game loop with `devicePixelRatio` scaling and `IntersectionObserver` pausing.

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
