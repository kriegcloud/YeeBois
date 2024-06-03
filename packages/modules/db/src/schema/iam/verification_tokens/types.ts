import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { verificationTokens } from './table';

export type VerificationTokens = InferSelectModel<typeof verificationTokens>;

export type VerificationTokensInsert = InferInsertModel<
  typeof verificationTokens
>;
