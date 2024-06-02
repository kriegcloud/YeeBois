import {
  mysqlTable,
  serial,
  timestamp,
  index,
  mysqlEnum,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { foreignKey, publicId } from '../../abs';
import { orgs } from '../orgs/table';
import {accounts} from "../../iam/account/table";
import {orgMemberProfiles} from "../org_member_profiles/table";

export const orgMembers = mysqlTable(
    'org_members',
    {
        id: serial('id').primaryKey(),
        publicId: publicId('orgMembers', 'public_id').notNull(),
        accountId: foreignKey('account_id'),
        orgId: foreignKey('org_id').notNull(),
        invitedByOrgMemberId: foreignKey('invited_by_org_member_id'),
        status: mysqlEnum('status', ['invited', 'active', 'removed']).notNull(),
        role: mysqlEnum('role', ['member', 'admin']).notNull(),
        orgMemberProfileId: foreignKey('org_member_profile_id').notNull(),
        addedAt: timestamp('added_at')
            .notNull()
            .$defaultFn(() => new Date()),
        removedAt: timestamp('removed_at')
    },
    (table) => ({
        publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
        accountIdIndex: index('account_id_idx').on(table.accountId),
        orgIdIndex: index('org_id_idx').on(table.orgId),
        orgaccountIndex: uniqueIndex('org_account_idx').on(
            table.orgId,
            table.accountId
        )
    })
);
export const orgMembersRelations = relations(orgMembers, ({ one, many }) => ({
    account: one(accounts, {
        fields: [orgMembers.accountId],
        references: [accounts.id]
    }),
    org: one(orgs, {
        fields: [orgMembers.orgId],
        references: [orgs.id]
    }),
    profile: one(orgMemberProfiles, {
        fields: [orgMembers.orgMemberProfileId],
        references: [orgMemberProfiles.id]
    })
}));
