import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    alias: {
      '@': path.resolve(__dirname, "./src"),
    },
    coverage: {
      reporter: ['text', 'html'],
    },
  },
}) 