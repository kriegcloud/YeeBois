import { relations } from 'drizzle-orm';
import {
  boolean,
  json,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { publicId } from '../../abs';
import { orgMemberProfiles } from '../../org/org_member_profiles/table';
import { orgMembers } from '../../org/org_members/table';
import { accountCredentials } from '../account_credentials/table';
import { authenticators } from '../authenticators/table';
import { sessions } from '../sessions/table';
import type { AccountMetadata } from './types';

export const accounts = mysqlTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('account', 'public_id').notNull(),
    username: varchar('username', { length: 32 }).notNull(),
    metadata: json('metadata').$type<AccountMetadata>(),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    lastLoginAt: timestamp('last_login_at'),
    passwordHash: varchar('password_hash', { length: 255 }),
    twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
    twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
    recoveryCode: varchar('recovery_code', { length: 256 }),
    preAccount: boolean('pre_account').notNull().default(true),
  },
  (table) => ({
    publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
    usernameIndex: uniqueIndex('username_idx').on(table.username),
  }),
);

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  authenticators: many(authenticators),
  accountCredential: one(accountCredentials, {
    fields: [accounts.id],
    references: [accountCredentials.accountId],
  }),
  sessions: many(sessions),
  orgMemberships: many(orgMembers),
  orgMemberProfiles: many(orgMemberProfiles),
}));
