import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {authenticators} from "./table";

export type Authenticators = InferSelectModel<typeof authenticators>;

export type AuthenticatorsInput = InferInsertModel<typeof authenticators>;
