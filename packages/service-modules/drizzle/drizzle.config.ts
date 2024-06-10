import type { Config } from 'drizzle-kit';

import dotenv from "dotenv";

dotenv.config();

export default {
  schema: './src/schema/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
} satisfies Config;
