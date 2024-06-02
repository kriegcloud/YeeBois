import { relations } from 'drizzle-orm';
import {
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { foreignKey, publicId } from '../../abs';
import { users } from '../../iam/users/table';
import { orgMemberProfiles } from '../org_member_profiles/table';
import { orgs } from '../orgs/table';

export const orgMembers = mysqlTable(
  'org_members',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('orgMembers', 'public_id').notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    orgId: foreignKey('org_id').notNull(),
    invitedByOrgMemberId: foreignKey('invited_by_org_member_id'),
    status: mysqlEnum('status', ['invited', 'active', 'removed']).notNull(),
    role: mysqlEnum('role', ['member', 'admin']).notNull(),
    orgMemberProfileId: foreignKey('org_member_profile_id').notNull(),
    addedAt: timestamp('added_at')
      .notNull()
      .$defaultFn(() => new Date()),
    removedAt: timestamp('removed_at'),
  },
  (table) => ({
    publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
    userIdIndex: index('account_id_idx').on(table.userId),
    orgIdIndex: index('org_id_idx').on(table.orgId),
    orgUserIndex: uniqueIndex('org_account_idx').on(table.orgId, table.userId),
  }),
);
export const orgMembersRelations = relations(orgMembers, ({ one, many }) => ({
  account: one(users, {
    fields: [orgMembers.userId],
    references: [users.id],
  }),
  org: one(orgs, {
    fields: [orgMembers.orgId],
    references: [orgs.id],
  }),
  profile: one(orgMemberProfiles, {
    fields: [orgMembers.orgMemberProfileId],
    references: [orgMemberProfiles.id],
  }),
}));
