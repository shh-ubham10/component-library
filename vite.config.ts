import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,           // allows using describe/it/expect without import
    environment: 'jsdom',    // needed for React DOM testing
    setupFiles: './src/test/setup.ts', // ✅ your actual setup file
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [...coverageConfigDefaults.exclude, 'storybook'],
    },
  },
})
