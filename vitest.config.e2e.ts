import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e.spec.ts'],
    // Os arquivos E2E compartilham o mesmo banco e removem seus fixtures.
    // A execucao sequencial evita corridas entre consultas e teardown.
    fileParallelism: false,
  },
});
