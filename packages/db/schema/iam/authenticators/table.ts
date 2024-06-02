import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { foreignKey, publicId } from '../../abs';
import { accounts } from '../account/table';
import { accountCredentials } from '../account_credentials/table';

export const authenticators = mysqlTable(
  'authenticators',
  {
    id: serial('id').primaryKey(),
    publicId: publicId('accountPasskey', 'public_id').notNull(),
    accountCredentialId: foreignKey('account_credential_id').notNull(),
    accountId: foreignKey('account_id').notNull(),
    nickname: varchar('nickname', { length: 64 }).notNull(),
    credentialID: varchar('credential_id', { length: 255 }).notNull(), //Uint8Array
    credentialPublicKey: text('credential_public_key').notNull(), //Uint8Array
    counter: bigint('counter', { unsigned: true, mode: 'bigint' }).notNull(), //bigint
    credentialDeviceType: varchar('credential_device_type', {
      length: 32,
    }).notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    transports:
      json('transports').$type<
        (
          | 'ble'
          | 'cable'
          | 'hybrid'
          | 'internal'
          | 'nfc'
          | 'smart-card'
          | 'usb'
        )[]
      >(),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    accountCredentialIdIndex: index('provider_account_id_idx').on(
      table.accountCredentialId,
    ),
    credentialIDIndex: uniqueIndex('credential_id_idx').on(table.credentialID),
  }),
);

export const authenticatorRelationships = relations(
  authenticators,
  ({ one }) => ({
    account: one(accounts, {
      fields: [authenticators.accountId],
      references: [accounts.id],
    }),
    accountCredentials: one(accountCredentials, {
      fields: [authenticators.accountCredentialId],
      references: [accountCredentials.id],
    }),
  }),
);
