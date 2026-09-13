import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const shared = {
  plugins: [react()],
  resolve: { tsconfigPaths: true },
};

export default defineConfig({
  test: {
    projects: [
      {
        ...shared,
        test: {
          name: 'lib',
          globals: true,
          environment: 'node',
          include: ['src/lib/**/*.test.ts'],
        },
      },
      {
        ...shared,
        test: {
          name: 'components',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/components/**/*.test.{ts,tsx}'],
        },
      },
    ],
  },
});
