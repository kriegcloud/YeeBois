import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './table';

export const zInsertUsers = createInsertSchema(users);

export const zSelectUsers = createSelectSchema(users);
