import type { Config } from 'tailwindcss';

import { dankTailwindPreset } from '@dank/tailwind';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  presets: [dankTailwindPreset],
};

export default config;
