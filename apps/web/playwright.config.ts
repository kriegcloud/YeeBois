import { defineConfig } from '@playwright/test';

import * as dotenv from 'dotenv';
import playwrightConfig from '@dank/playwright/playwright.config';
dotenv.config({ path: './env.local' });

export default defineConfig({
  ...playwrightConfig,
});
