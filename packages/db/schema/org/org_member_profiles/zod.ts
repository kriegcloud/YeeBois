import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orgMemberProfiles } from "./table";

export const zInsertOrgMemberProfiles = createInsertSchema(orgMemberProfiles);

export const zSelectOrgMemberProfiles = createSelectSchema(orgMemberProfiles);