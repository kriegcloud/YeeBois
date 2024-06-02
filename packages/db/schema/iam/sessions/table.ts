import { relations } from 'drizzle-orm';
import {
  index,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { foreignKey, publicId } from '../../abs';
import { accounts } from '../account/table';

export const sessions = mysqlTable(
  'sessions',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('accountSession', 'public_id').notNull(),
    accountId: foreignKey('account_id').notNull(),
    accountPublicId: publicId('account', 'account_public_id').notNull(),
    sessionToken: varchar('session_token', { length: 255 }).notNull(),
    device: varchar('device', { length: 255 }).notNull(),
    os: varchar('os', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    accountIdIndex: index('account_id_idx').on(table.accountId),
    sessionTokenIndex: uniqueIndex('session_token_idx').on(table.sessionToken),
    expiryIndex: index('expires_at_idx').on(table.expiresAt),
  }),
);
export const sessionRelationships = relations(sessions, ({ one }) => ({
  account: one(accounts, {
    fields: [sessions.accountId],
    references: [accounts.id],
  }),
}));
