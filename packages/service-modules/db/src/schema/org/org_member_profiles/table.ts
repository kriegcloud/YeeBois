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
import { users } from '../../iam/users/table';
import { orgs } from '../orgs/table';

export const orgMemberProfiles = mysqlTable(
  'org_member_profiles',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('orgMemberProfile', 'public_id').notNull(),
    orgId: foreignKey('org_id').notNull(),
    avatarTimestamp: timestamp('avatar_timestamp'),
    userId: varchar('user_id', { length: 255 }).notNull(),
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
    userIdIndex: index('account_id_idx').on(table.userId),
  }),
);

export const orgMemberProfileRelations = relations(
  orgMemberProfiles,
  ({ one }) => ({
    account: one(users, {
      fields: [orgMemberProfiles.userId],
      references: [users.id],
    }),
    org: one(orgs, {
      fields: [orgMemberProfiles.orgId],
      references: [orgs.id],
    }),
  }),
);
