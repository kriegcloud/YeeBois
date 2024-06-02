import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { accounts } from './table';

export type AccountMetaBonus = {
  item: 'unin';
  bonus: { enabled: boolean };
  bonusReason: string;
  awardedByName: string;
  awardedByAccountId: number;
  awardedAt: Date;
  note: string;
};
export type AccountMetadata = {
  bonuses?: AccountMetaBonus[];
};

export type Accounts = InferSelectModel<typeof accounts>;

export type AccountsInput = InferInsertModel<typeof accounts>;
