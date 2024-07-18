import type { AnyColumn } from './column.ts';
import type { Logger } from './logger.ts';
import { Table } from './table.ts';

export function haveSameKeys(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const [index, key] of leftKeys.entries()) {
    if (key !== rightKeys[index]) {
      return false;
    }
  }

  return true;
}

export type OneOrMany<T> = T | T[];

export type Update<T, TUpdate> = {
  [K in Exclude<keyof T, keyof TUpdate>]: T[K];
} & TUpdate;

export type Simplify<T> = {
  // @ts-ignore - "Type parameter 'K' has a circular constraint", not sure why
  [K in keyof T]: T[K];
} & {};

export type SimplifyMappedType<T> = [T] extends [unknown] ? T : never;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ShallowRecord<K extends keyof any, T> = SimplifyMappedType<{
  [P in K]: T;
}>;

export type Assume<T, U> = T extends U ? T : U;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

export interface DrizzleTypeError<T extends string> {
  $drizzleTypeError: T;
}

export type ValueOrArray<T> = T | T[];

/** @internal */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function applyMixins(baseClass: any, extendedClasses: any[]) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === 'constructor') continue;

      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) ||
          Object.create(null),
      );
    }
  }
}

export type Or<T1, T2> = T1 extends true
  ? true
  : T2 extends true
    ? true
    : false;

export type IfThenElse<If, Then, Else> = If extends true ? Then : Else;

export type PromiseOf<T> = T extends Promise<infer U> ? U : T;

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function getTableColumns<T extends Table>(table: T): T['_']['columns'] {
  return table[Table.Symbol.Columns];
}


export type ColumnsWithTable<
  TTableName extends string,
  TForeignTableName extends string,
  TColumns extends AnyColumn<{ tableName: TTableName }>[],
> = { [Key in keyof TColumns]: AnyColumn<{ tableName: TForeignTableName }> };

export interface DrizzleConfig<
  TSchema extends Record<string, unknown> = Record<string, never>,
> {
  logger?: boolean | Logger;
  schema?: TSchema;
}
export type ValidateShape<T, ValidShape, TResult = T> = T extends ValidShape
  ? Exclude<keyof T, keyof ValidShape> extends never
    ? TResult
    : DrizzleTypeError<`Invalid key(s): ${Exclude<
        keyof T & (string | number | bigint | boolean | null | undefined),
        keyof ValidShape
      >}`>
  : never;

export type KnownKeysOnly<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never;
};

export type IsAny<T> = 0 extends 1 & T ? true : false;
