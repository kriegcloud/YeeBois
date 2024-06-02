import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {orgInvitations} from "./table";

export type OrgInvitations = InferSelectModel<typeof orgInvitations>;

export type OrgInvitationsInput = InferInsertModel<typeof orgInvitations>;
