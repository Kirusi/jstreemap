import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Target environment ('node' for backend, 'jsdom' or 'happy-dom' for frontend)
    environment: 'node',
    reporters: ['default'],
  },
});
