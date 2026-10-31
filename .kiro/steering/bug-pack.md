# bug-pack.md — Bug pack format and rules

## What a bug pack is
A self-contained unit that defines one monster encounter:
- The buggy JavaScript file the player edits
- The tests that must pass to defeat the monster
- The reference solution (validation only — never shown to the player)
- The hints Sudo delivers on request
- The autopsy card text shown after the monster is defeated

## File structure (required — enforced by validation hook)

```
src/bugs/NN-monster-name/
├── index.ts       # Manifest
├── broken.js      # The file the player edits
├── solution.js    # Reference solution
└── tests.js       # Test suite
```

The autopsy text lives inside `index.ts`, not in a separate file.

## index.ts manifest shape

```typescript
import type { BugPack } from '../../types/BugPack'

const pack: BugPack = {
  id: 'null-ghost',              // kebab-case, matches folder name
  order: 1,                      // spawn order in the game (1–8)
  monster: {
    name: 'Null Ghost',          // display name on monster sprite
    fileLabel: 'profile.js',     // file name shown above the monster
    behaviour: 'half-visible',   // description for art/animation spec
  },
  hints: [
    // Level 1: location
    'Check the line that reads user.address.city.',
    // Level 2: type
    'Address can be null. The code assumes it never is.',
    // Level 3: solution
    'Read address?.city — or check if address exists before reading city.',
  ],
  autopsy: {
    what: 'Address was null; city was read without checking.',
    impact: '500 errors on every profile page for users without a saved address.',
    fix: 'Use optional chaining: `user.address?.city ?? null`',
  },
  morning: {
    // Used in the morning meeting epilogue
    question: 'The profile service was throwing 500s last night. What was wrong?',
    answers: [
      { text: 'The server ran out of memory.', level: null },
      { text: 'A user with no address caused a null dereference.', level: 'senior' },
      { text: 'The database connection timed out.', level: null },
    ],
    correct: 1, // index into answers array
  },
}

export default pack
```

## broken.js rules
- Plain JavaScript (not TypeScript)
- Contains exactly one bug — the one this pack teaches
- Must be a realistic file a developer might write. Not contrived.
- Variable and function names match the monster's `fileLabel`
- The validation hook runs the tests against this file and asserts they FAIL

## solution.js rules
- Same structure as broken.js
- Contains the correct fix
- Must not introduce new logic beyond fixing the bug
- The validation hook runs the tests against this file and asserts they ALL PASS

## tests.js rules
- Plain JavaScript
- Uses the inline test runner format (no imports, `__testResults__` array)
- Must have at least 3 tests
- Tests must be behaviour-based, not implementation-based
  (test what the function returns, not how it does it)
- Must cover the happy path AND the bug case

## Inline test runner format (used inside the Web Worker)

```javascript
const __testResults__ = []

function test(name, fn) {
  try { fn(); __testResults__.push({ name, ok: true }) }
  catch (e) { __testResults__.push({ name, ok: false, error: e.message }) }
}

function expect(val) {
  return {
    toBe(expected) {
      if (val !== expected) throw new Error(`Expected ${expected}, got ${val}`)
    },
    toBeNull() {
      if (val !== null) throw new Error(`Expected null, got ${val}`)
    },
    toBeTruthy() {
      if (!val) throw new Error(`Expected truthy, got ${val}`)
    },
  }
}

// Tests follow:
test('returns city when address exists', () => {
  expect(getUserCity({ address: { city: 'Istanbul' } })).toBe('Istanbul')
})
// ...
```

## Validation hook contract
The hook at `.kiro/hooks/validate-bug-pack.ts` must:
1. Run `tests.js` against `broken.js` — assert at least one test FAILS
2. Run `tests.js` against `solution.js` — assert ALL tests PASS
3. Check that `index.ts` exports a valid `BugPack` object (all required fields present)
4. Check that hints array has exactly 3 entries
5. Exit non-zero and print a clear error if any check fails

A bug pack that does not pass the hook cannot be merged or loaded by the game.

## The 8 bug packs

| Order | ID | File | Bug type |
|---|---|---|---|
| 1 | null-ghost | profile.js | Null dereference (optional chaining) |
| 2 | off-by-one | pagination.js | Loop boundary off by one |
| 3 | infinite-crawler | retry.js | Missing loop exit condition |
| 4 | async-phantom | payment.js | Missing await |
| 5 | memory-leech | cache.js | Cache never cleared |
| 6 | race-twins | inventory.js | Race condition on shared state |
| 7 | deadlock | transfer.js | Locks acquired in reverse order |
| 8 | legacy | billing.js + invoice.js + utils.js | Floating-point rounding propagation |

Packs 1–5 are the priority. Packs 6–7 may be cut if timeline slips. Pack 8 (Legacy / final boss)
is required and may be simplified to a single-file version if needed.
