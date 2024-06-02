import { typeIdDataType as publicId } from '@dank/utils';
import {
  bigint,
  boolean,
  customType,
  index,
  int,
  json,
  mediumint,
  mediumtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

export { publicId };
// Foreign Key type as drizzle does not support unsigned bigint
export const foreignKey = customType<{ data: number }>({
  dataType() {
    return 'bigint unsigned';
  },
  fromDriver(value: unknown): number {
    return Number(value);
  },
});
