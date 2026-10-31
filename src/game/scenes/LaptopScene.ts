import Phaser from 'phaser'
import { mountEditor } from '../../editor/monacoLoader'
import { runCode } from '../../worker/codeRunner'
import type { BugPack } from '../../types/BugPack'

/**
 * LaptopScene — overlays the office with the Monaco code editor.
 *
 * Launch with:
 *   this.scene.launch('LaptopScene', { pack: bugPackInstance })
 *
 * Emits 'bug-solved' on the scene when all tests pass.
 */
export class LaptopScene extends Phaser.Scene {
  private pack!: BugPack
  private container!: HTMLDivElement
  private outputEl!: HTMLDivElement
  private editor: Awaited<ReturnType<typeof mountEditor>> | null = null

  constructor() {
    super({ key: 'LaptopScene' })
  }

  init(data: { pack: BugPack }): void {
    this.pack = data.pack
  }

  create(): void {
    // Dim background
    this.add.rectangle(480, 270, 960, 540, 0x000000, 0.85)

    // Laptop frame
    this.add.rectangle(480, 270, 720, 440, 0x161b22).setStrokeStyle(1, 0x30363d)

    // File label
    this.add
      .text(480, 70, this.pack.monster.fileLabel, {
        fontSize: '13px',
        color: '#8b949e',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)

    // Monaco container
    this.container = document.createElement('div')
    this.container.id = 'monaco-container'
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '13%',
      left: '8%',
      width: '58%',
      height: '62%',
      zIndex: '10',
      border: '1px solid #30363d',
      borderRadius: '4px',
      overflow: 'hidden',
    })

    // Test output panel
    this.outputEl = document.createElement('div')
    this.outputEl.id = 'test-output'
    Object.assign(this.outputEl.style, {
      position: 'fixed',
      top: '13%',
      left: '67%',
      width: '25%',
      height: '62%',
      zIndex: '10',
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '4px',
      color: '#8b949e',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '10px',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
    })
    this.outputEl.textContent = 'Run tests to see results.'

    document.body.appendChild(this.container)
    document.body.appendChild(this.outputEl)

    // Boot animation while Monaco loads
    this.container.innerHTML =
      '<div style="color:#484f58;font-family:monospace;padding:16px">Laptop booting…</div>'

    mountEditor(this.container, this.pack.brokenCode).then((ed) => {
      this.editor = ed
    })

    // Run tests button
    this.add
      .text(310, 506, '[ RUN TESTS ]', {
        fontSize: '13px',
        color: '#3fb950',
        fontFamily: 'monospace',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => void this.runTests())

    // Hint button
    this.add
      .text(560, 506, '[ HINT ]', {
        fontSize: '13px',
        color: '#d29922',
        fontFamily: 'monospace',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHint())

    // Close hint
    this.add
      .text(480, 527, 'ESC — close laptop', {
        fontSize: '11px',
        color: '#484f58',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)

    this.input.keyboard!.addKey('ESC').on('down', () => this.closeLaptop())
  }

  // ── Hint state ────────────────────────────────────────────────────────────
  private hintLevel = 0

  private showHint(): void {
    if (this.hintLevel >= this.pack.hints.length) {
      this.appendOutput('\nSudo: "I\'ve told you everything I know."', '#484f58')
      return
    }
    const msg = `\nSudo: "${this.pack.hints[this.hintLevel]}"`
    this.appendOutput(msg, '#d29922')
    this.hintLevel++
  }

  // ── Test runner ───────────────────────────────────────────────────────────
  private async runTests(): Promise<void> {
    if (!this.editor) return
    const code = this.editor.getValue()
    this.outputEl.textContent = 'Running…'

    const result = await runCode(code, this.pack.testCode)

    if (result.error && result.error !== 'timeout') {
      this.outputEl.style.color = '#f85149'
      this.outputEl.textContent = `Error:\n${result.error}`
      return
    }

    this.outputEl.style.color = '#c9d1d9'
    this.outputEl.textContent = result.output

    if (result.passed) {
      this.outputEl.style.color = '#3fb950'
      this.outputEl.textContent += '\n\n✓ All tests pass.\nMonster defeated.'
      this.time.delayedCall(1200, () => {
        this.events.emit('bug-solved', this.pack.id)
        this.closeLaptop()
      })
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private appendOutput(text: string, color: string): void {
    const span = document.createElement('span')
    span.style.color = color
    span.textContent = text
    this.outputEl.appendChild(span)
    this.outputEl.scrollTop = this.outputEl.scrollHeight
  }

  private closeLaptop(): void {
    this.container.remove()
    this.outputEl.remove()
    this.editor?.dispose()
    this.editor = null
    this.scene.stop()
    this.scene.resume('OfficeScene')
  }
}
