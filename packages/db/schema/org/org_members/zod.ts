import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { orgMembers } from './table';

export const zInsertOrgMembers = createInsertSchema(orgMembers);

export const zSelectOrgMembers = createSelectSchema(orgMembers);
