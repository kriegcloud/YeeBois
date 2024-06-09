import { AuthProvider } from '@dank/authprovider';
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Config } from 'sst/node/config';
import { z } from 'zod';

const checkIss = z
  .function()
  .args(
    z.object({
      issInput: z.string(),
      region: z.string(),
      userPoolId: z.string(),
    }),
  )
  .returns(z.boolean())
  .implement((args) => {
    const { issInput, region, userPoolId } = args;
    const iss = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    return iss === issInput;
  });

const authProvider = new AuthProvider();

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  // console.log("event.methodArn", event.methodArn);
  // arn:aws:execute-api:ap-southeast-2:724086772446:w88l3u4l29/$default/DELETE/api/v0.0.1/items/167d6020-6081-4b11-9223-5d59a8002715

  // Extract the bearer authorization token from the event
  const authHeader = event.authorizationToken;
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const token = authHeader.split(' ')[1]!;

  // Load the JWKS (JSON Web Key Set) from the well-known endpoint
  // @ts-ignore
  const jwksUrl = `https://cognito-idp.${Config.REGION}.amazonaws.com/${Config.USER_POOL_ID}/.well-known/jwks.json`;
  const client = jwksClient({ jwksUri: jwksUrl });

  let principalId: string | undefined;
  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      throw new Error('Unable to decode token');
    }

    // @ts-ignore
    const issInput = decoded.payload['iss'];

    if (
      !checkIss({
        issInput,
        // @ts-ignore
        region: Config.REGION,
        // @ts-ignore
        userPoolId: Config.USER_POOL_ID,
      })
    ) {
      throw new Error('Invalid iss');
    }
    // @ts-ignore
    if (decoded.payload['token_use'] !== 'access') {
      throw new Error('Invalid token_use');
    }
    // @ts-ignore
    if (decoded.payload.sub !== decoded.payload['client_id']) {
      throw new Error('Invalid client_id');
    }

    const userPoolClient = await authProvider.describeUserPoolClient({
      // @ts-ignore
      clientId: decoded.payload['client_id'],
    });

    // the client name is the sub
    principalId = userPoolClient.ClientName;

    if (!userPoolClient) {
      throw new Error('User pool client not found');
    }

    // decode the token to get the kid
    const kid = decoded?.header.kid;
    // get the public key from the JWKS
    const key = await client.getSigningKey(kid);
    // verify the token
    jwt.verify(token, key.getPublicKey());
  } catch (err) {
    console.error('Error verifying token', err);
    // Return an authorization response indicating the request is not authorized
    return {
      // @ts-ignore
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: event.methodArn,
          },
        ],
      },
    };
  }

  // return an authorization response indicating the request is authorized
  // @ts-ignore
  return {
    // @ts-ignore
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        },
      ],
    },
    context: {
      sub: principalId,
    },
  } satisfies APIGatewayAuthorizerResult;
};
