import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    globalSetup: ['./tests/globalSetup.ts'],
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],

    // Coverage totals show up in terminal via the "text" reporter
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      exclude: [
        'src/main/database/schema/index.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/out/**',
        '**/coverage/**'
      ],
      // Optional: make CI fail if coverage drops below these numbers
      // thresholds: {
      //   statements: 80,
      //   branches: 70,
      //   functions: 75,
      //   lines: 80
      // }
    },

    pool: 'forks',
    forceReRunTriggers: [],
    teardownTimeout: 10000
  },

  resolve: {
    alias: {
      electron: new URL('./tests/__mocks__/electron.ts', import.meta.url).pathname
    }
  }
})