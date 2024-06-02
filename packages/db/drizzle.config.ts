import type { Config } from 'drizzle-kit';
import { env } from './env';

export default {
  schema: './schema/schema.ts',
  out: './migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: env.DATABASE_URL,
  }
} satisfies Config;
