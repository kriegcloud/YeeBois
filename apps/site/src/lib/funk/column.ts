import type {
  ColumnBuilderBaseConfig,
  ColumnBuilderRuntimeConfig,
  ColumnDataType,
  GeneratedColumnConfig,
  GeneratedIdentityConfig,
} from './column-builder.ts';
import { entityKind } from './entity.ts';
import type { Table } from './table.ts';
import type { Update } from './utils.ts';

export interface ColumnBaseConfig<
  TDataType extends ColumnDataType,
  TColumnType extends string,
> extends ColumnBuilderBaseConfig<TDataType, TColumnType> {
  tableName: string;
  notNull: boolean;
  hasDefault: boolean;
  hasRuntimeDefault: boolean;
}

export type ColumnTypeConfig<T extends ColumnBaseConfig<ColumnDataType, string>, TTypeConfig extends object> = T & {
  brand: 'Column';
  name: T['name'];
  dataType: T['dataType'];
  columnType: T['columnType'];
  data: T['data'];
  notNull: T['notNull'];
  hasDefault: T['hasDefault'];
  hasRuntimeDefault: T['hasRuntimeDefault'];
  enumValues: T['enumValues'];
  baseColumn: T extends { baseColumn: infer U } ? U : unknown;
  generated: GeneratedColumnConfig<T['data']> | undefined;
} & TTypeConfig;

export type ColumnRuntimeConfig<TData, TRuntimeConfig extends object> = ColumnBuilderRuntimeConfig<
  TData,
  TRuntimeConfig
>;


export abstract class Column<
  T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>,
  TRuntimeConfig extends object = object,
  TTypeConfig extends object = object,
> {
  static readonly [entityKind]: string = 'Column';

  declare readonly _: ColumnTypeConfig<T, TTypeConfig>;

  readonly name: string;
  readonly primary: boolean;
  readonly notNull: boolean;
  readonly default: T['data'] | undefined;
  readonly defaultFn: (() => T['data']) | undefined;
  readonly onUpdateFn: (() => T['data']) | undefined;
  readonly hasDefault: boolean;
  readonly uniqueName: string | undefined;
  readonly uniqueType: string | undefined;
  readonly dataType: T['dataType'];
  readonly columnType: T['columnType'];
  readonly generated: GeneratedColumnConfig<T['data']> | undefined = undefined;
  readonly generatedIdentity: GeneratedIdentityConfig | undefined = undefined;

  protected config: ColumnRuntimeConfig<T['data'], TRuntimeConfig>;

  protected constructor(
    readonly table: Table,
    config: ColumnRuntimeConfig<T['data'], TRuntimeConfig>,
  ) {
    this.config = config;
    this.name = config.name;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType as T['dataType'];
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
  }

  // ** @internal */
  shouldDisableInsert(): boolean {
    return this.config.generated !== undefined && this.config.generated.type !== 'byDefault';
  }
}

export type UpdateColConfig<
  T extends ColumnBaseConfig<ColumnDataType, string>,
  TUpdate extends Partial<ColumnBaseConfig<ColumnDataType, string>>,
> = Update<T, TUpdate>;

export type AnyColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = Column<
  Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>
>;

export type GetColumnData<TColumn extends Column, TInferMode extends 'query' | 'raw' = 'query'> =
  TInferMode extends 'raw' // Raw mode
    ? TColumn['_']['data'] // Just return the underlying type
    : TColumn['_']['notNull'] extends true // Query mode
      ? TColumn['_']['data'] // Query mode, not null
      : TColumn['_']['data'] | null; // Query mode, nullable

export type InferColumnsDataTypes<TColumns extends Record<string, Column>> = {
  [Key in keyof TColumns]: GetColumnData<TColumns[Key], 'query'>;
};