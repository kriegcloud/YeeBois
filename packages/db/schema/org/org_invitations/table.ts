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
import { orgMemberProfiles } from '../org_member_profiles/table';
import { orgMembers } from '../org_members/table';
import { orgs } from '../orgs/table';
import { ORG_ROLES } from './constants';

export const orgInvitations = mysqlTable(
  'org_invitations',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('orgInvitations', 'public_id').notNull(),
    orgId: foreignKey('org_id').notNull(),
    invitedByOrgMemberId: foreignKey('invited_by_org_member_id').notNull(),
    role: mysqlEnum('role', ORG_ROLES).notNull(),
    orgMemberId: foreignKey('org_member_id'),
    invitedOrgMemberProfileId: foreignKey('invited_org_member_profile_id'),
    email: varchar('email', { length: 128 }),
    inviteToken: varchar('invite_token', { length: 64 }),
    invitedAt: timestamp('invited_at')
      .notNull()
      .$defaultFn(() => new Date()),
    expiresAt: timestamp('expires_at'),
    acceptedAt: timestamp('accepted_at'),
  },
  (table) => ({
    publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
    orgIdIndex: index('org_id_idx').on(table.orgId),
    orgMemberIdIndex: uniqueIndex('org_member_id_idx').on(table.orgMemberId),
    orgEmailUniqueIndex: uniqueIndex('org_email_unique_idx').on(
      table.orgId,
      table.email,
    ),
  }),
);
export const orgInvitationsRelations = relations(orgInvitations, ({ one }) => ({
  org: one(orgs, {
    fields: [orgInvitations.orgId],
    references: [orgs.id],
  }),
  invitedByOrgMember: one(orgMembers, {
    fields: [orgInvitations.invitedByOrgMemberId],
    references: [orgMembers.id],
  }),
  orgMember: one(orgMembers, {
    fields: [orgInvitations.orgMemberId],
    references: [orgMembers.id],
  }),
  invitedProfile: one(orgMemberProfiles, {
    fields: [orgInvitations.invitedOrgMemberProfileId],
    references: [orgMemberProfiles.id],
  }),
}));
