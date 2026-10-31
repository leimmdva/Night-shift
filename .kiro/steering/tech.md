# tech.md — Technology decisions and rationale

## Stack

| Layer | Tool | Version | Decision |
|---|---|---|---|
| Language | TypeScript | latest | Catches errors early; player-facing code stays plain JS |
| Build | Vite | 8.x | Fast dev server, static output, no server required |
| Game engine | Phaser | 3.x | Physics, tilemaps, animation, input — all built-in |
| Tilemap editor | Tiled | latest | Free, exports JSON, loads directly into Phaser |
| Code editor | Monaco | 0.52.x | Real VS Code feel; loaded from npm, not CDN |
| Code execution | Web Worker | native | Sandbox per run; terminated after 5s timeout |
| State / save | localStorage | native | Checkpoint and postmortem data only; no server |
| Unit + PBT tests | Vitest + fast-check | latest | Property-based tests for bug pack validation |
| E2E tests | Playwright | latest | Full game flow automation |
| Deployment | GitHub Pages | — | Free, same repo, no extra account |

## Monaco loading strategy
1. `preloadMonaco()` is called at game boot — Monaco starts loading in the background immediately.
2. The player cannot open the laptop until the first monster appears (~60 seconds in).
3. If Monaco is still loading when the player presses E, a "Laptop booting…" animation plays.
   This animation is part of the game world, not a loading spinner.
4. **No language workers.** `languageWorkers: []` in vite-plugin-monaco-editor config.
   - Autocomplete is disabled. This is intentional: autocomplete would solve the puzzle for the player.
   - Syntax highlighting is kept.
   - Bundle size is significantly smaller without `typescript-language-features` worker.
5. Monaco is its own Vite chunk. Phaser is its own chunk. They load in parallel.

## Web Worker sandbox
- A new Worker is created for every run attempt. Workers are never reused.
- The worker is terminated after `TIMEOUT_MS = 5000`. This prevents infinite loop bugs
  (e.g. Infinite Crawler) from freezing the page.
- Player code runs via `new Function(...)` inside the worker — never in the main thread.
- Test framework is a ~20-line inline runner; no external test library inside the worker.

## Performance targets (measured on live deploy, not local build)
- Tested with empty cache + throttled connection (Slow 4G in DevTools)
- First Contentful Paint: < 3s
- Game interactive (Phaser ready): < 5s
- Monaco ready: before first monster appears (~60s) — background load has enough time
- If GitHub Pages Lighthouse scores are poor → migrate to Cloudflare Pages (one config file change)

## Deployment
- Base URL: `/night-shift/` (set in `vite.config.ts`)
- GitHub Actions workflow: push to `main` → build → deploy to `gh-pages` branch
- Live demo must remain reachable until 30 January 2027 (Kiroween requirement)

## What is explicitly excluded
- No LLM calls at runtime. Hints and autopsy text are pre-written strings.
  Reason: cost, latency, and offline reliability for the jury demo.
- No TypeScript language worker in Monaco (see Monaco section above).
- No external state management library (Redux, Zustand, etc.). Game state lives in Phaser scenes
  and plain TypeScript modules.
