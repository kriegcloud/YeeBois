import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sessions } from './table';

export const zInsertSessions = createInsertSchema(sessions);

export const zSelectSessions = createSelectSchema(sessions);
