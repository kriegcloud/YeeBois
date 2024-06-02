import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { DefaultSession, NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';

import { db } from '@dank/db';
import { accounts, sessions, users } from '@dank/db/schema';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [Discord],
  callbacks: {
    session: (opts) => {
      if (!('user' in opts)) throw 'unreachable with session strategy';

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;
