import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {accountCredentials} from "./table";

export type AccountCredentials = InferSelectModel<typeof accountCredentials>;

export type AccountCredentialsInput = InferInsertModel<typeof accountCredentials>;
