import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { orgs } from './table';

export type OrgMetaBonus = {
  item: 'domain';
  bonus: { count: number } | { enabled: boolean };
  bonusReason: string;
  awardedByName: string;
  awardedByAccountId: number;
  awardedAt: Date;
  note: string;
};
export type OrgMetadata = {
  bonuses?: OrgMetaBonus[];
};

export type Orgs = InferSelectModel<typeof orgs>;

export type OrgsInput = InferInsertModel<typeof orgs>;
