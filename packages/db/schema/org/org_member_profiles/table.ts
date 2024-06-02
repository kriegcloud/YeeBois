import { relations } from 'drizzle-orm';
import {
  index,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { foreignKey, publicId } from '../../abs';
import { accounts } from '../../iam/account/table';
import { orgs } from '../orgs/table';

export const orgMemberProfiles = mysqlTable(
  'org_member_profiles',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('orgMemberProfile', 'public_id').notNull(),
    orgId: foreignKey('org_id').notNull(),
    avatarTimestamp: timestamp('avatar_timestamp'),
    accountId: foreignKey('account_id'),
    firstName: varchar('first_name', { length: 64 }),
    lastName: varchar('last_name', { length: 64 }),
    handle: varchar('handle', { length: 64 }),
    title: varchar('title', { length: 64 }),
    blurb: text('blurb'),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
    accountIdIndex: index('account_id_idx').on(table.accountId),
  }),
);

export const orgMemberProfileRelations = relations(
  orgMemberProfiles,
  ({ one }) => ({
    account: one(accounts, {
      fields: [orgMemberProfiles.accountId],
      references: [accounts.id],
    }),
    org: one(orgs, {
      fields: [orgMemberProfiles.orgId],
      references: [orgs.id],
    }),
  }),
);
