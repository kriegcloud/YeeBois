import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {sessions} from "./table";

export type Sessions = InferSelectModel<typeof sessions>;

export type SessionsInput = InferInsertModel<typeof sessions>;
