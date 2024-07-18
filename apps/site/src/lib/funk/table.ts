import type { Column, GetColumnData } from './column.ts';
import { entityKind } from './entity.ts';
import type { OptionalKeyOnly, RequiredKeyOnly } from './operations.ts';
import type { Simplify, Update } from './utils.ts';

export interface TableConfig<TColumn extends Column = Column<any>> {
  name: string;
  schema: string | undefined;
  columns: Record<string, TColumn>;
}

export type UpdateTableConfig<T extends TableConfig, TUpdate extends Partial<TableConfig>> = Required<
  Update<T, TUpdate>
>;

/** @internal */
export const TableName = Symbol.for('dank:Name');

/** @internal */
export const Schema = Symbol.for('dank:Schema');

/** @internal */
export const Columns = Symbol.for('dank:Columns');

/** @internal */
export const OriginalName = Symbol.for('dank:OriginalName');

/** @internal */
export const BaseName = Symbol.for('dank:BaseName');

/** @internal */
export const IsAlias = Symbol.for('dank:IsAlias');

/** @internal */
export const ExtraConfigBuilder = Symbol.for('dank:ExtraConfigBuilder');

const IsDankTable = Symbol.for('dank:IsDankTable');

export class Table<T extends TableConfig = TableConfig> {
  static readonly [entityKind]: string = 'Table';
  declare readonly _: {
    readonly brand: 'Table';
    readonly config: T;
    readonly name: T['name'];
    readonly schema: T['schema'];
    readonly columns: T['columns'];
    readonly inferSelect: InferSelectModel<Table<T>>;
    readonly inferInsert: InferInsertModel<Table<T>>;
  };

  declare readonly $inferSelect: InferSelectModel<Table<T>>;
  declare readonly $inferInsert: InferInsertModel<Table<T>>;

  /** @internal */
  static readonly Symbol = {
    Name: TableName as typeof TableName,
    Schema: Schema as typeof Schema,
    OriginalName: OriginalName as typeof OriginalName,
    Columns: Columns as typeof Columns,
    BaseName: BaseName as typeof BaseName,
    IsAlias: IsAlias as typeof IsAlias,
  };

  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName]: string;

  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName]: string;

  /** @internal */
  [Schema]: string | undefined;

  /** @internal */
  [Columns]!: T['columns'];

  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName]: string;

  /** @internal */
  [IsAlias] = false;

  constructor(name: string, schema: string | undefined, baseName: string) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
}

export function isTable(table: unknown): table is Table {
  return typeof table === 'object' && table !== null && IsDankTable in table;
}

/**
 * Any table with a specified boundary.
 *
 * @example
 ```ts
 // Any table with a specific name
 type AnyUsersTable = AnyTable<{ name: 'users' }>;
 ```
 *
 * To describe any table with any config, simply use `Table` without any type arguments, like this:
 *
 ```ts
 function needsTable(table: Table) {
 ...
 }
 ```
 */
export type AnyTable<TPartial extends Partial<TableConfig>> = Table<UpdateTableConfig<TableConfig, TPartial>>;

export function getTableName<T extends Table>(table: T): T['_']['name'] {
  return table[TableName];
}

export function getTableUniqueName<T extends Table>(table: T): `${T['_']['schema']}.${T['_']['name']}` {
  return `${table[Schema] ?? 'public'}.${table[TableName]}`;
}

export type MapColumnName<TName extends string, TColumn extends Column, TDBColumNames extends boolean> =
  TDBColumNames extends true ? TColumn['_']['name']
    : TName;

export type InferModelFromColumns<
  TColumns extends Record<string, Column>,
  TInferMode extends 'select' | 'insert' = 'select',
  TConfig extends { dbColumnNames: boolean } = { dbColumnNames: false },
> = Simplify<
  TInferMode extends 'insert' ?
    & {
      [
      Key in keyof TColumns & string as RequiredKeyOnly<
        MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>,
        TColumns[Key]
      >
      ]: GetColumnData<TColumns[Key], 'query'>;
    }
    & {
    [
    Key in keyof TColumns & string as OptionalKeyOnly<
      MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>,
      TColumns[Key]
    >
    ]?: GetColumnData<TColumns[Key], 'query'>;
  }
    : {
      [
      Key in keyof TColumns & string as MapColumnName<
        Key,
        TColumns[Key],
        TConfig['dbColumnNames']
      >
      ]: GetColumnData<TColumns[Key], 'query'>;
    }
>;

/** @deprecated Use one of the alternatives: {@link InferSelectModel} / {@link InferInsertModel}, or `table.$inferSelect` / `table.$inferInsert`
 */
export type InferModel<
  TTable extends Table,
  TInferMode extends 'select' | 'insert' = 'select',
  TConfig extends { dbColumnNames: boolean } = { dbColumnNames: false },
> = InferModelFromColumns<TTable['_']['columns'], TInferMode, TConfig>;

export type InferSelectModel<
  TTable extends Table,
  TConfig extends { dbColumnNames: boolean } = { dbColumnNames: false },
> = InferModelFromColumns<TTable['_']['columns'], 'select', TConfig>;

export type InferInsertModel<
  TTable extends Table,
  TConfig extends { dbColumnNames: boolean } = { dbColumnNames: false },
> = InferModelFromColumns<TTable['_']['columns'], 'insert', TConfig>;
