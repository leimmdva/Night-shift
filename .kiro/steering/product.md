# product.md — What Night Shift is and who it is for

## One-line pitch
A browser horror game where bugs turn into monsters — fix the code, kill the monster, survive until dawn.

## Goal
Not pure entertainment. The player learns to debug JavaScript by doing it under pressure.
By the end of a run, they can:
- Read an error log and find the affected file
- Identify a failing test and locate the root cause
- Recognise seven common bug patterns by behaviour
- Distinguish symptom from root cause
- Read a postmortem report of their own weak spots

## Player
A developer (student or junior) who already knows basic JavaScript syntax but has not yet built
the instinct to read stack traces, spot null dereferences, or reason about async flow.
The game meets them where they are: no algorithmic puzzles, no trick questions — real bugs from real code.

## Scope (firm boundaries)
### In
- Single-floor office, top-down 2D view
- 8 monsters, each tied to one bug type
- 4 acts (23:47 / 00:30 / 02:00 / 03:33) + morning epilogue
- Monaco editor with JavaScript syntax highlighting (no autocomplete)
- Sandboxed Web Worker test runner
- Autopsy card after each kill
- Sudo hint system (3 levels, unlimited, small score penalty)
- Checkpoint on death (solved bugs stay solved, one hint gained)
- Normal and Easy difficulty modes
- Postmortem report saved to localStorage
- Morning meeting: 3 recall questions, title determined by answers
- 15–20 minute total playtime target

### Out (do not add without an explicit written decision)
- Multiplayer
- 3D
- LLM calls at runtime
- TypeScript language worker in Monaco (autocomplete)
- Mobile / touch controls
- More than one floor
- More than 8 monsters in the base game

## Success criteria for submission
- A jury member with no prior context can finish the game in under 20 minutes without help
- At least 3 external playtesters complete it without assistance (target: week of 22–28 Nov)
- All tests pass, live demo reachable, video under 3 minutes
