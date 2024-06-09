import { z } from 'zod';

export const constants = z.nativeEnum({
  serviceName: 'yeebois',
  displayName: 'Yee Bois',
  region: 'us-east-1',
  profile: 'elpresidank',
  prodStageName: 'prod',
  devStageName: 'dev',
  devUrl: 'http://localhost:3000',
  nextjsSitePath: 'apps/web',
  nextAuthSecret: 'REPLACE_ME', // execute 'openssl rand -base64 32' to generate a secret
  nextAuthUrl: 'https://____REPLACE_ME____.cloudfront.net',
  authCallbackSuffix: '/api/auth/callback/cognito',
  authStackId: 'Auth',
  apiStackId: 'Api',
  cognitoUserPoolClientId: 'UserPoolClient',
  nextjsSiteId: 'site',
  userPoolDomainId: 'UserPoolDomain',
  resourceServerId: 'ResourceServer',
  resourceServerIdentifier: 't4',
  appsCountLimit: 2,
});

export const paramNames = z.nativeEnum({
  region: 'REGION',
  userPoolId: 'USER_POOL_ID',
  userPoolClientId: 'USER_POOL_CLIENT_ID',
  userPoolClientSecret: 'USER_POOL_CLIENT_SECRET',
  nextAuthSecret: 'NEXTAUTH_SECRET',
  apiUrl: 'API_URL',
  cognitoDomain: 'COGNITO_DOMAIN',
  itemsTableName: 'ITEMS_TABLE_NAME',
  appsTableName: 'APPS_TABLE_NAME',
  apiEndpointUrl: 'API_ENDPOINT_URL',
});

export const tableNames = z.nativeEnum({
  items: 'items',
  apps: 'apps',
});

export const routes = z.nativeEnum({
  items: '/items',
  home: '/home',
  docs: '/docs',
  apps: '/apps',
});
