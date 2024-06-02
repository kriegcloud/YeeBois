import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { publicId } from '../../abs';

export const users = mysqlTable('user', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  publicId: publicId('account', 'public_id').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  lastLoginAt: timestamp('last_login_at'),
  passwordHash: varchar('password_hash', { length: 255 }),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
  recoveryCode: varchar('recovery_code', { length: 256 }),
  preAccount: boolean('pre_account').notNull().default(true),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    fsp: 3,
  }),
  image: varchar('image', { length: 255 }),
});
