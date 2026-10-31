/**
 * monacoLoader.ts
 *
 * Starts loading Monaco in the background as soon as the game boots.
 * The laptop scene calls mountEditor() when the player opens the laptop.
 * If Monaco is still loading, the "Laptop booting..." animation plays
 * until the promise resolves — making the wait part of the game.
 */

import type * as Monaco from 'monaco-editor'

let monacoPromise: Promise<typeof Monaco> | null = null

/** Call once at game start — kicks off the background load. */
export function preloadMonaco(): void {
  if (monacoPromise) return
  monacoPromise = import('monaco-editor').then((m) => {
    // Syntax highlighting only — no language workers
    m.editor.defineTheme('nightshift', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', foreground: 'c9d1d9', background: '0d1117' }],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editorLineNumber.foreground': '#484f58',
      },
    })
    return m
  })
}

/** Call when the player opens the laptop. Resolves when Monaco is ready. */
export async function getMonaco(): Promise<typeof Monaco> {
  if (!monacoPromise) preloadMonaco()
  return monacoPromise!
}

/**
 * Mount an editor into a DOM container.
 * Returns the editor instance.
 */
export async function mountEditor(
  container: HTMLElement,
  initialCode: string
): Promise<Monaco.editor.IStandaloneCodeEditor> {
  const monaco = await getMonaco()

  const editor = monaco.editor.create(container, {
    value: initialCode,
    language: 'javascript',
    theme: 'nightshift',
    fontSize: 13,
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    // No quickSuggestions — keeps puzzle intact
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    parameterHints: { enabled: false },
  })

  return editor
}
