/**
 * codeRunner.ts
 *
 * Runs player-submitted code in a sandboxed Web Worker.
 * A new worker is created for each run attempt.
 * The worker is terminated after TIMEOUT_MS to prevent infinite loops
 * from freezing the page.
 */

const TIMEOUT_MS = 5000

export interface RunResult {
  passed: boolean
  output: string
  error?: string
}

export function runCode(
  playerCode: string,
  testCode: string
): Promise<RunResult> {
  return new Promise((resolve) => {
    // Inline worker source — no separate file needed
    const workerSource = `
      self.onmessage = function(e) {
        const { playerCode, testCode } = e.data
        const results = []
        let passed = true
        let errorMsg = null

        try {
          // Execute player code
          const fn = new Function(playerCode + '\\n' + testCode + '\\nreturn __testResults__')
          const testResults = fn()
          results.push(...testResults)
          passed = results.every(r => r.ok)
        } catch (err) {
          passed = false
          errorMsg = err instanceof Error ? err.message : String(err)
        }

        self.postMessage({ passed, results, error: errorMsg })
      }
    `

    const blob = new Blob([workerSource], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url, { type: 'classic' })

    const timer = setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({
        passed: false,
        output: 'Time limit exceeded — check for infinite loops',
        error: 'timeout',
      })
    }, TIMEOUT_MS)

    worker.onmessage = (e) => {
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)

      const { passed, results, error } = e.data
      const output = results
        ? results.map((r: { name: string; ok: boolean }) =>
            `${r.ok ? '✓' : '✗'} ${r.name}`
          ).join('\n')
        : ''

      resolve({ passed, output, error })
    }

    worker.onerror = (e) => {
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({
        passed: false,
        output: '',
        error: e.message,
      })
    }

    worker.postMessage({ playerCode, testCode })
  })
}
