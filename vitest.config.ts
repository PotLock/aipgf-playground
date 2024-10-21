import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './__tests__'),
      '@mocks': path.resolve(__dirname, './__mocks__')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/unit/setup/index.ts'],
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)', './__tests__/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/layout.tsx',
        'src/**/\\[...rest\\]/page.tsx',
        'src/middleware.ts',
        'src/configs',
        'src/common/constants',
        'src/modules/**/validators',
        'src/libs'
      ],
      extension: ['.ts', '.tsx', '.js', '.jsx'],
      reportsDirectory: './unit-coverage',
      provider: 'istanbul', // or 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
