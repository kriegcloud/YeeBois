import type { DBType } from '@dank/drizzle';
import type { HttpBindings } from '@hono/node-server';
import type { Context } from 'hono';
import type { DatabaseSession } from 'lucia';

export type Ctx = {
  Bindings: HttpBindings;
  Variables: {
    account: AccountContext;
  };
};

export type OrgContext = {
  id: number;
  publicId: string;
  name: string;
  memberId?: number;
  members: {
    id: number;
    accountId: number | null;
    // Refer to DB schema orgMembers.role and orgMembers.status
    status: 'invited' | 'active' | 'removed';
    role: 'admin' | 'member';
  }[];
} | null;

export type AccountContext = {
  id: number;
  session: DatabaseSession;
} | null;

export type TrpcContext = {
  db: DBType;
  account: AccountContext;
  org: OrgContext;
  event: Context<Ctx>;
};
