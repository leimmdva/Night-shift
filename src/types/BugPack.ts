/**
 * BugPack — the shape of every bug encounter in Night Shift.
 * Each pack lives in src/bugs/NN-monster-name/index.ts.
 */

export interface MorningAnswer {
  text: string
  /** null = wrong answer, 'mid' | 'senior' | 'staff' = the title this answer earns */
  level: 'mid' | 'senior' | 'staff' | null
}

export interface BugPack {
  /** kebab-case, matches the folder name */
  id: string

  /** Spawn order in the game (1–8) */
  order: number

  monster: {
    /** Display name shown on the monster sprite */
    name: string
    /** File name shown floating above the monster */
    fileLabel: string
    /** Short description for the art / animation spec */
    behaviour: string
  }

  /**
   * Sudo hints — exactly 3 entries:
   * [0] location hint, [1] type hint, [2] solution hint
   */
  hints: [string, string, string]

  autopsy: {
    /** One sentence: what the bug was */
    what: string
    /** One sentence: what this causes in production */
    impact: string
    /** One sentence or short code snippet: the correct fix */
    fix: string
  }

  morning: {
    /** The recall question asked in the morning meeting epilogue */
    question: string
    /** Exactly 3 answer options */
    answers: [MorningAnswer, MorningAnswer, MorningAnswer]
    /** Index (0–2) of the correct answer */
    correct: 0 | 1 | 2
  }

  /**
   * The buggy JavaScript code shown to the player in the editor.
   * Plain JS string — not a file import.
   */
  brokenCode: string

  /**
   * The test suite run in the Web Worker.
   * Must FAIL against brokenCode, must PASS against solutionCode.
   */
  testCode: string

  /**
   * Reference solution — used only by the validation hook.
   * Never shown to the player.
   */
  solutionCode: string
}
