# structure.md — Folder layout and file conventions

## Repository root

```
night-shift/
├── .kiro/
│   ├── steering/          # These files — project rules for Kiro
│   │   ├── product.md
│   │   ├── tech.md
│   │   ├── structure.md
│   │   ├── voice.md
│   │   └── bug-pack.md
│   ├── specs/             # One spec per major system
│   └── hooks/             # Automation hooks (e.g. bug-pack validator)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deploy
├── src/
│   ├── main.ts            # Entry point: boot Phaser, start Monaco preload
│   ├── style.css
│   ├── game/
│   │   ├── game.ts        # Phaser.Game config
│   │   └── scenes/
│   │       ├── BootScene.ts
│   │       ├── OfficeScene.ts   # Main 2D office — player moves here
│   │       └── LaptopScene.ts   # Code editor overlay
│   ├── editor/
│   │   └── monacoLoader.ts      # Background preload + mountEditor()
│   ├── worker/
│   │   └── codeRunner.ts        # Sandboxed Web Worker runner
│   ├── bugs/                    # One folder per bug pack
│   │   └── 01-null-ghost/
│   │       ├── index.ts         # Bug pack manifest (see bug-pack.md)
│   │       ├── broken.js        # The buggy file the player edits
│   │       ├── solution.js      # Reference solution (not shown to player)
│   │       ├── tests.js         # Test suite run in the worker
│   │       └── autopsy.md       # Autopsy card text
│   └── ui/                      # HUD, autopsy card, postmortem report components
├── public/                      # Static assets (sprites, tilemaps, audio)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── LICENSE
├── README.md
└── KIRO_LOG.md                  # Daily dev log (lives in workspace, copied to repo)
```

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Phaser scenes | PascalCase + `Scene` suffix | `OfficeScene.ts` |
| Bug pack folders | `NN-kebab-name` | `01-null-ghost/` |
| Bug pack monster ID | matches folder name | `null-ghost` |
| Steering files | lowercase kebab | `bug-pack.md` |
| Spec files | `system-name.md` | `editor.md`, `runner.md` |
| Hook files | `hook-name.ts` | `validate-bug-pack.ts` |

## Bug pack folder rule
Every bug pack folder under `src/bugs/` must contain exactly:
- `index.ts` — manifest with monster ID, name, file label, hints, autopsy text
- `broken.js` — the file shown to the player (contains the bug)
- `solution.js` — reference solution (used by the validation hook only)
- `tests.js` — test suite (must fail on broken.js, must pass on solution.js)

The validation hook (`hooks/validate-bug-pack.ts`) enforces this.
A pack that does not pass the hook cannot be loaded by the game.

## What goes in `.kiro/` vs `src/`
- `.kiro/` — instructions for Kiro and the developer. Never imported by game code.
- `src/` — everything that runs in the browser.
- `KIRO_LOG.md` — lives in the Kiro Crew workspace AND is copied to the repo root for the jury.
