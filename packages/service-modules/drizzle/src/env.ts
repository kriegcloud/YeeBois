import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
  server: {
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DATABASE_URL: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env['CI'] || !!process.env['SKIP_ENV_VALIDATION'],
});
