import Phaser from 'phaser'
import { mountEditor } from '../../editor/monacoLoader'
import { runCode } from '../../worker/codeRunner'

/**
 * LaptopScene — overlays the office with the code editor.
 * Placeholder bug: profile.js null check (Null Ghost).
 */

const PLACEHOLDER_BUG = `// profile.js
// Fix the bug: city should not be read from a null address
function getUserCity(user) {
  return user.address.city  // BUG: address can be null
}
`

const PLACEHOLDER_TESTS = `
const __testResults__ = []

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
      if (val !== expected) throw new Error(\`Expected \${expected}, got \${val}\`)
    },
    toBeNull() {
      if (val !== null) throw new Error(\`Expected null, got \${val}\`)
    }
  }
}

test('returns city when address exists', () => {
  expect(getUserCity({ address: { city: 'Istanbul' } })).toBe('Istanbul')
})

test('returns null when address is missing', () => {
  expect(getUserCity({ address: null })).toBeNull()
})

test('returns null when user has no address property', () => {
  expect(getUserCity({})).toBeNull()
})
`

export class LaptopScene extends Phaser.Scene {
  private container!: HTMLDivElement
  private outputEl!: HTMLDivElement
  private editor: unknown = null

  constructor() {
    super({ key: 'LaptopScene' })
  }

  create(): void {
    // Dim background
    this.add.rectangle(480, 270, 960, 540, 0x000000, 0.85)

    // Laptop frame
    this.add.rectangle(480, 270, 720, 440, 0x161b22).setStrokeStyle(1, 0x30363d)

    // Mount HTML overlay for Monaco
    this.container = document.createElement('div')
    this.container.id = 'monaco-container'
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '10%',
      left: '15%',
      width: '55%',
      height: '60%',
      zIndex: '10',
      border: '1px solid #30363d',
      borderRadius: '4px',
      overflow: 'hidden',
    })

    this.outputEl = document.createElement('div')
    this.outputEl.id = 'test-output'
    Object.assign(this.outputEl.style, {
      position: 'fixed',
      top: '10%',
      left: '71%',
      width: '14%',
      height: '60%',
      zIndex: '10',
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '4px',
      color: '#c9d1d9',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '8px',
      overflowY: 'auto',
    })
    this.outputEl.textContent = 'Run tests to see results'

    document.body.appendChild(this.container)
    document.body.appendChild(this.outputEl)

    // "Laptop booting..." text while Monaco loads
    this.container.textContent = 'Laptop booting...'

    mountEditor(this.container, PLACEHOLDER_BUG).then((ed) => {
      this.editor = ed
    })

    // Run button
    this.add
      .text(480, 500, '[ RUN TESTS ]', { fontSize: '14px', color: '#3fb950' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.runTests())

    // Close hint
    this.add
      .text(480, 525, 'ESC — close laptop', { fontSize: '11px', color: '#484f58' })
      .setOrigin(0.5)

    this.input.keyboard!.addKey('ESC').on('down', () => this.closeLaptop())
  }

  private async runTests(): Promise<void> {
    if (!this.editor) return
    const monaco = await import('../../editor/monacoLoader')
    const ed = this.editor as Awaited<ReturnType<typeof monaco.mountEditor>>
    const code = ed.getValue()
    this.outputEl.textContent = 'Running...'
    const result = await runCode(code, PLACEHOLDER_TESTS)
    this.outputEl.textContent = result.output || result.error || 'No output'

    if (result.passed) {
      this.outputEl.style.color = '#3fb950'
      this.outputEl.textContent += '\n\n✓ All tests pass!\nMonster defeated.'
    } else {
      this.outputEl.style.color = '#f85149'
    }
  }

  private closeLaptop(): void {
    this.container.remove()
    this.outputEl.remove()
    this.scene.stop()
    this.scene.resume('OfficeScene')
  }
}
