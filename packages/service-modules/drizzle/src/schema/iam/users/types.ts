import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from './table';

export type Users = InferSelectModel<typeof users>;

export type UsersInput = InferInsertModel<typeof users>;
