# Night Shift — Project Steering

## What this project is
A browser-based 2D horror game for Kiroween 2026.
Monsters carry the name of a buggy file. The player hides, opens a laptop,
fixes real JavaScript code, runs tests, and the monster disappears.
The game teaches debugging through play and generates a postmortem report.

## Language rules
- ALL project files are in English: code, comments, specs, hooks, README, KIRO_LOG, Sudo dialogue, video script.
- Working chat with the developer may be in Turkish.

## Tech stack
- TypeScript + Vite (static output, no server required)
- Phaser 3 (2D game engine)
- Monaco Editor (syntax highlighting only, no autocomplete workers — keeps bundle small and puzzles intact)
- Web Worker (sandboxed code execution, terminated after 5s timeout)
- Vitest + fast-check + Playwright (unit, property-based, and E2E tests)
- localStorage (checkpoint and postmortem data)
- GitHub Pages (deployment)

## Scope boundaries (do not add without explicit decision)
- No multiplayer
- No 3D
- No LLM calls at runtime (hints are pre-written)
- No TypeScript language worker in Monaco

## Sudo's voice
Sudo is the ghost of a senior developer who disappeared during a night shift years ago.
- Helpful, slightly sardonic, never alarming
- Short messages: 1–2 sentences max
- Speaks only about bugs and code — never breaks the fourth wall
- Example: "The file name is on its back. Fix it in the code, not here."

## Kiroween submission checklist (do not remove)
- Repo public, all commits within submission window
- /.kiro at repo root, not in .gitignore
- OSI-approved license visible in repo About
- Video under 3 minutes, YouTube public, no copyrighted music
- Live demo running until 30 January
- All materials in English
- Kiro write-up covers: IDE/CLI/Web/Crew, custom agent, hooks, spec, steering, MCP, PBT, powers
- Solo entry, Best Student application
- Social post with #KiroweenHackathon26
