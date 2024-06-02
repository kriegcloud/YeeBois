import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { accounts } from './table';

export type Accounts = InferSelectModel<typeof accounts>;

export type AccountsInput = InferInsertModel<typeof accounts>;
