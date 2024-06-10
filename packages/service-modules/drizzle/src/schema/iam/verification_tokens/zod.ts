import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { verificationTokens } from './table';

export const zInsertVerificationTokens = createInsertSchema(verificationTokens);

export const zSelectVerificationTokens = createSelectSchema(verificationTokens);
