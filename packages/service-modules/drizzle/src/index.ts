import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import * as schema from './schema/schema';
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import {RDS} from "sst/node/rds";

const connectionOptions = {
  logger: false,
  schema,
};

export const db = drizzle(new RDSDataClient(), {
  // @ts-ignore
  database: RDS.db.defaultDatabaseName,
  // @ts-ignore
  secretArn: RDS.db.secretArn,
  // @ts-ignore
  resourceArn: RDS.db.clusterArn,
  schema,
});
export type DBType = typeof db;
