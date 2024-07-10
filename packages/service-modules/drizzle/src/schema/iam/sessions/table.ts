import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users/table';

export const sessions = pgTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});
