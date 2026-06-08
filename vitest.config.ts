import { defineConfig, mergeConfig } from 'vite-plus';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      exclude: ['e2e/**', 'node_modules/**'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/vite-env.d.ts',
          'src/test/**',
          'src/types/**',
          'src/**/*.test.{ts,tsx}',
        ],
        reporter: ['text', 'lcov'],
        thresholds: {
          statements: 60,
          branches: 60,
          functions: 50,
          lines: 60,
        },
      },
    },
  }),
);
