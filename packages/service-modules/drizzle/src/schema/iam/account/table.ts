import {
  boolean,
  json,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { publicId } from '../../abs';
import { users } from '../users/table';
import { AccountMetadata } from './types';

export const accounts = pgTable(
  'account',
  {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    metadata: json('metadata').$type<AccountMetadata>(),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    lastLoginAt: timestamp('last_login_at'),
    passwordHash: text('password_hash'),
    twoFactorSecret: text('two_factor_secret'),
    twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
    recoveryCode: text('recovery_code'),
    preAccount: boolean('pre_account').notNull().default(true),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);
