import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {orgMembers} from "./table";

export type OrgMembers = InferSelectModel<typeof orgMembers>;

export type OrgMembersInput = InferInsertModel<typeof orgMembers>;
