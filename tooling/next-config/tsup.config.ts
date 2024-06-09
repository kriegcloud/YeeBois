import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
  entry: ['./next.config.ts', './next.config-pwa.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  minify: !opts.watch,
  clean: !opts.watch,
  experimentalDts: true,
  outDir: 'dist',
}));
