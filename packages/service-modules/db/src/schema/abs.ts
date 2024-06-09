import { customType } from 'drizzle-orm/mysql-core';
import { typeIdDataType as publicId } from '../utils';

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
