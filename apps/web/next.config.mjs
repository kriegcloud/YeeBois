import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))('./src/env');
import bundleAnalyzer from '@next/bundle-analyzer';


const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env['ANALYZE'] === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@dank/ui',
    '@dank/db',
    '@dank/auth',
    '@dank/utils',
    '@dank/api',
  ],
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default withBundleAnalyzer(nextConfig);
