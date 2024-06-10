import { z } from 'zod';

export const constants = z.nativeEnum({
  serviceName: 'muckrat',
  displayName: 'Muck Rat',
  region: 'us-east-1',
  profile: 'elpresidank',
  prodStageName: 'prod',
  devStageName: 'dev',
  devUrl: 'http://localhost:3000',
  nextjsSitePath: 'apps/web',
  nextAuthSecret: 'REPLACE_ME', // execute 'openssl rand -base64 32' to generate a secret
  nextAuthUrl: 'https://muckrat.com',
  authCallbackSuffix: '/api/auth/callback/cognito',
  authStackId: 'Auth',
  apiStackId: 'Api',
  cognitoUserPoolClientId: 'UserPoolClient',
  nextjsSiteId: 'web',
  userPoolDomainId: 'UserPoolDomain',
  resourceServerId: 'ResourceServer',
  resourceServerIdentifier: 'dank',
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
