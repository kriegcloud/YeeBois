import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {orgMemberProfiles} from "./table";

export type OrgMemberProfiles = InferSelectModel<typeof orgMemberProfiles>;

export type OrgMemberProfilesInput = InferInsertModel<typeof orgMemberProfiles>;
