import {
  CognitoIdentityProviderClient,
  CreateUserPoolClientCommand,
  CreateUserPoolClientCommandInput,
  DeleteUserPoolClientCommand,
  DeleteUserPoolClientCommandInput,
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { constants } from '@dank/constants';
import { scopesSchema } from '@dank/types';
import { Config } from 'sst/node/config';
import { z } from 'zod';

class AuthProvider {
  private cognitoClient: CognitoIdentityProviderClient;
  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      // @ts-ignore
      region: Config.REGION,
    });
  }

  deleteUserPoolClient = z
    .function()
    .args(z.object({ clientId: z.string() }))
    .implement(async (args) => {
      const command = new DeleteUserPoolClientCommand({
        ClientId: args.clientId,
        // @ts-ignore
        UserPoolId: Config.USER_POOL_ID,
      } satisfies DeleteUserPoolClientCommandInput);
      return await this.cognitoClient.send(command);
    });

  createUserPoolClient = z
    .function()
    .args(z.object({ clientName: z.string() }))
    .implement(async (args) => {
      const command = new CreateUserPoolClientCommand({
        GenerateSecret: true,
        SupportedIdentityProviders: ['COGNITO'],
        // @ts-ignore
        UserPoolId: Config.USER_POOL_ID,
        ClientName: args.clientName,
        AllowedOAuthFlowsUserPoolClient: true,
        AllowedOAuthFlows: ['client_credentials'],
        AllowedOAuthScopes: [
          `${constants.enum.resourceServerIdentifier}/${scopesSchema.enum.readItems}`,
          `${constants.enum.resourceServerIdentifier}/${scopesSchema.enum.writeItems}`,
        ],
      } satisfies CreateUserPoolClientCommandInput);
      return await this.cognitoClient.send(command);
    });

  describeUserPoolClient = z
    .function()
    .args(z.object({ clientId: z.string() }))
    .implement(async (args) => {
      const command = new DescribeUserPoolClientCommand({
        ClientId: args.clientId,
        // @ts-ignore
        UserPoolId: Config.USER_POOL_ID,
      } satisfies DescribeUserPoolClientCommandInput);
      const response = await this.cognitoClient.send(command);
      if (!response.UserPoolClient?.ClientSecret) {
        throw new Error('User pool client secret not found');
      }
      if (!response.UserPoolClient?.ClientId) {
        throw new Error('User pool client id not found');
      }
      return response.UserPoolClient;
    });
}

export { AuthProvider };
