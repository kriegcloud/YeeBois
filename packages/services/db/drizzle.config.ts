import type { Config } from 'drizzle-kit';
import { env } from './src/env';

export default {
  schema: './src/schema/schema.ts',
  out: './migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
