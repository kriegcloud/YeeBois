import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { orgInvitations } from './table';

export const zInsertOrgInvitations = createInsertSchema(orgInvitations);

export const zSelectOrgInvitations = createSelectSchema(orgInvitations);
