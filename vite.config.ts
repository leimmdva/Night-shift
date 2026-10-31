import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  base: '/night-shift/',
  plugins: [
    // Monaco split into its own chunk, loaded separately
    // TypeScript language worker is excluded — syntax highlighting only,
    // no autocomplete (keeps bundle small, prevents puzzle spoilers)
    (monacoEditorPlugin as any).default({
      languageWorkers: [], // no language workers — syntax only
      customWorkers: [],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split phaser into its own chunk; monaco is handled by the plugin
        manualChunks(id: string) {
          if (id.includes('phaser')) return 'phaser'
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
})
