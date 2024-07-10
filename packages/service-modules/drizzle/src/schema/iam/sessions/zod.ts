import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sessions } from './table';

export const zInsertSession = createInsertSchema(sessions);

export const zSelectSession = createSelectSchema(sessions);
