import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    exclude: ['node_modules', 'src/node/__tests__/e2e'],
    threads: true,
    maxThreads: 2,
    minThreads: 1
  }
});
