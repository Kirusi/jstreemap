import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Target environment ('node' for backend, 'jsdom' or 'happy-dom' for frontend)
    environment: 'node',
    reporters: ['default', 'json'],
    outputFile: './build/dev-tests.json',
    includeSource: ['test/**/*.{js,ts}'],
    coverage: {
      enabled: true,
      include: ['src/**/*.{js,ts}'],
      provider: 'istanbul', // or 'v8'
      reporter: ['text', 'json', 'html', 'lcov'], // Formats: terminal, JSON, and interactive browser pages
      reportsDirectory: './build/coverage',
      // reportOnFailure: true, // Generates reports even if tests fail
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
