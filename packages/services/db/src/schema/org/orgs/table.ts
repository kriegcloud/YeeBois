import { relations } from 'drizzle-orm';
import {
  json,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { publicId } from '../../abs';
import { users } from '../../iam/users/table';
import { orgMemberProfiles } from '../org_member_profiles/table';
import { orgMembers } from '../org_members/table';
import { OrgMetadata } from './types';

export const orgs = mysqlTable(
  'orgs',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('org', 'public_id').notNull(),
    avatarTimestamp: timestamp('avatar_timestamp'),
    shortcode: varchar('shortcode', { length: 64 }).notNull(),
    ownerId: varchar('owner_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 64 }).notNull(),
    metadata: json('metadata').$type<OrgMetadata>().default({}),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
    shortcodeIndex: uniqueIndex('shortcode_idx').on(table.shortcode),
  }),
);
export const orgsRelations = relations(orgs, ({ one, many }) => ({
  owner: one(users, {
    fields: [orgs.ownerId],
    references: [users.id],
  }),
  members: many(orgMembers),
  orgMemberProfiles: many(orgMemberProfiles),
}));
