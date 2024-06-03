import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
  entry: [
    './sentry.client.config.ts',
    './sentry.server.config.ts',
    './sentry.edge.config.ts'
  ],
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  minify: !opts.watch,
  clean: !opts.watch,
  experimentalDts: true,
  outDir: 'dist',
}));
