import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { foreignKey } from '../../abs';
import { accounts } from '../account/table';
import { authenticators } from '../authenticators/table';
export const accountCredentials = mysqlTable(
  'account_credentials',
  {
    id: serial('id').primaryKey(),
    accountId: foreignKey('account_id').notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
    twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
    recoveryCode: varchar('recovery_code', { length: 256 }),
  },
  (accountAuth) => ({
    accountIdIndex: index('account_id_idx').on(accountAuth.accountId),
  }),
);

export const accountAuthRelationships = relations(
  accountCredentials,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [accountCredentials.accountId],
      references: [accounts.id],
    }),
    authenticators: many(authenticators),
  }),
);
