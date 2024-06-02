import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { accounts } from './table';

export const zInsertAccounts = createInsertSchema(accounts);

export const zSelectAccounts = createSelectSchema(accounts);
