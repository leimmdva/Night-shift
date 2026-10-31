# voice.md — Game language and Sudo's voice

## UI language
All in-game text is in English. This includes:
- HUD labels
- Sudo messages
- Autopsy card text
- Postmortem report
- Morning meeting questions and answer options
- Error logs and test output shown to the player

## Tone
The game is tense, not gory. The horror comes from recognition — the player sees their own
bad habits come to life. Keep text dry and technical, not dramatic.

Avoid:
- Exclamation marks (except in error output where they are conventional)
- "You must...", "You need to..." — too instructional
- Exposition that explains the horror — let the player feel it

## Sudo

Sudo is the ghost of a senior developer who disappeared during a night shift years ago.
He communicates via Slack-like messages on the player's laptop.

### Voice rules
- 1–2 sentences maximum per message
- Never greets or signs off. No "Hey" or "Good luck."
- Speaks only about the code. Never about the monsters directly.
- Slightly sardonic but never mean. He has seen this before.
- Uses lowercase for casual observations, proper case for code references.
- Never breaks the fourth wall (no "press E", no "click the button")

### Hint levels (per bug pack, written in index.ts)

**Level 1 — location:** Points to where the problem is, not what it is.
> "Check the line that reads `user.address.city`."

**Level 2 — type:** Names the class of error without solving it.
> "Address can be null. The code assumes it never is."

**Level 3 — solution:** Gives the fix in plain words.
> "Read `address?.city` — or check if address exists before reading city."

### Sudo message timing
- Appears only when the player requests a hint (presses the hint key)
- Each level appears once per bug. Requesting again moves to the next level.
- After level 3, Sudo stops responding. "I've told you everything I know."

## Autopsy card

Shown immediately after a monster is defeated.
Three short sections, plain text, no headers:

1. **What happened** — one sentence naming the bug (e.g. "Address was null, city read without checking.")
2. **Real-world impact** — one sentence on what this causes in production (e.g. "500 errors on every profile page of users without an address.")
3. **The right approach** — one sentence or one short code snippet showing the correct pattern.

Keep each section under 20 words. The player is still in the game.

## Morning meeting (epilogue)

Three short questions, each with three answer options (Mid / Senior / Staff level answers).
Questions test recall, not new knowledge. They reference bugs the player has already solved.
Tone: a slightly tired CTO asking for a quick debrief.

Example:
> "The profile service was throwing 500s last night. What was wrong?"
> A) The server ran out of memory.
> B) A user with no address caused a null dereference.  ← correct
> C) The database connection timed out.

The title earned (Mid / Senior / Staff) is shown on the postmortem report.
