import type { BugPack } from '../../types/BugPack'

const pack: BugPack = {
  id: 'null-ghost',
  order: 1,

  monster: {
    name: 'Null Ghost',
    fileLabel: 'profile.js',
    behaviour:
      'Semi-transparent; only fully visible in the flashlight beam. Moves slowly.',
  },

  hints: [
    // Level 1 — location
    'Look at the line that reads user.address.city.',
    // Level 2 — type
    'address can be null. The code never checks.',
    // Level 3 — solution
    "Use optional chaining: user.address?.city ?? null",
  ],

  autopsy: {
    what: 'address was null; city was read without a null check.',
    impact: 'A 500 error on every profile page for users without a saved address.',
    fix: '`user.address?.city ?? null`',
  },

  morning: {
    question: 'The profile service was throwing 500s last night. Root cause?',
    answers: [
      { text: 'The database connection timed out.', level: null },
      {
        text: 'A user with no address caused a null dereference on city.',
        level: 'senior',
      },
      { text: 'The server ran out of memory.', level: null },
    ],
    correct: 1,
  },

  brokenCode: `// profile.js
// Bug: address can be null, but city is read directly from it.

function getUserCity(user) {
  return user.address.city
}
`,

  testCode: `const __testResults__ = []

function test(name, fn) {
  try {
    fn()
    __testResults__.push({ name, ok: true })
  } catch (e) {
    __testResults__.push({ name, ok: false, error: e.message })
  }
}

function expect(val) {
  return {
    toBe(expected) {
      if (val !== expected)
        throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(val))
    },
    toBeNull() {
      if (val !== null)
        throw new Error('Expected null, got ' + JSON.stringify(val))
    },
  }
}

test('returns the city when address exists', () => {
  expect(getUserCity({ address: { city: 'Istanbul' } })).toBe('Istanbul')
})

test('returns null when address is null', () => {
  expect(getUserCity({ address: null })).toBeNull()
})

test('returns null when address property is missing', () => {
  expect(getUserCity({})).toBeNull()
})
`,

  solutionCode: `// profile.js
function getUserCity(user) {
  return user.address?.city ?? null
}
`,
}

export default pack
