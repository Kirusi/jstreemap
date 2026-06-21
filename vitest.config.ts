import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Enables global test functions like describe, it, and expect
    globals: true,
    // Target environment ('node' for backend, 'jsdom' or 'happy-dom' for frontend)
    environment: 'node',
  },
})