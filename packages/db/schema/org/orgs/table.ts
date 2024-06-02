import {
    mysqlTable,
    serial,
    varchar,
    timestamp,
    json,
    uniqueIndex
} from 'drizzle-orm/mysql-core';
import { relations } from "drizzle-orm";
import {accounts} from "../../iam/account/table";
import {foreignKey, publicId} from "../../abs";
import {OrgMetadata} from "./types";
import {orgMembers} from "../org_members/table";
import {orgMemberProfiles} from "../org_member_profiles/table";

export const orgs = mysqlTable(
    'orgs',
    {
        id: serial('id').primaryKey(),
        publicId: publicId('org', 'public_id').notNull(),
        avatarTimestamp: timestamp('avatar_timestamp'),
        shortcode: varchar('shortcode', { length: 64 }).notNull(),
        ownerId: foreignKey('owner_id').notNull(),
        name: varchar('name', { length: 64 }).notNull(),
        metadata: json('metadata').$type<OrgMetadata>().default({}),
        createdAt: timestamp('created_at')
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => ({
        publicIdIndex: uniqueIndex('public_id_idx').on(table.publicId),
        shortcodeIndex: uniqueIndex('shortcode_idx').on(table.shortcode)
    })
);
export const orgsRelations = relations(orgs, ({ one, many }) => ({
    owner: one(accounts, {
        fields: [orgs.ownerId],
        references: [accounts.id]
    }),
    members: many(orgMembers),
    orgMemberProfiles: many(orgMemberProfiles)
}));