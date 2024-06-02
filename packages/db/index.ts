import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { Client } from '@planetscale/database';
import { env } from './env';
import * as schema from './schema/schema';

const client = new Client({
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    fetch: (url, init) => {
        // biome-ignore lint/performance/noDelete: <explanation>
        init && delete init.cache;
        const u = new URL(url);
        // set protocol to http if localhost for CI testing
        if (u.host.includes('localhost') || u.host.includes('127.0.0.1')) {
            u.protocol = 'http';
        }
        return fetch(u, init);
    }
});

const connectionOptions = {
    logger: false,
    schema
};

export const db = drizzle(client, connectionOptions);
export type DBType = typeof db;
