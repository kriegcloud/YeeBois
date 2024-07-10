import type { Config } from 'tailwindcss';

import { withUt } from 'uploadthing/tw';

import { dankTailwindPreset } from '@dank/tailwind';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/dist/**/*.js'],
  darkMode: 'class',
  presets: [dankTailwindPreset],
};

export default withUt(config);
