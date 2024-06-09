import { paramNames, tableNames } from '@dank/constants';
import { Config } from 'sst/constructs';
import { type Stack, Table } from 'sst/constructs';

export const appsStack = (stack: Stack) => {
  const table = new Table(stack, tableNames.enum.apps, {
    fields: {
      sub: 'string',
      id: 'string',
    },
    primaryIndex: { partitionKey: 'sub', sortKey: 'id' },
  });

  const tableName = new Config.Parameter(stack, paramNames.enum.appsTableName, {
    value: table.tableName,
  });

  return {
    table,
    tableName,
  };
};
