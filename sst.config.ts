import { SSTConfig } from 'sst';
import {
  Api,
  Config,
  NextjsSite,
  RDS,
  Script,
  StackContext,
  StaticSite,
  use,
} from 'sst/constructs';

export function WebSiteStack({ stack }: StackContext) {
  const deployed = ['test', 'prod'].includes(stack.stage);

  const nextDomain = `${
    stack.stage === 'prod' ? 'next' : `${stack.stage}-next`
  }.muckrat.com`;
  const nextCustomDomain = {
    domainName: nextDomain,
    hostedZone: 'muckrat.com',
  };

  const rds = new RDS(stack, 'db', {
    engine: 'postgresql13.9',
    defaultDatabaseName: 'app_database',
  });

  new Script(stack, 'migrations', {
    defaults: {
      function: {
        bind: [rds],
        timeout: 300,
        copyFiles: [
          {
            from: 'packages/service-modules/drizzle/migrations',
            to: 'migrations',
          },
        ],
      },
    },
    onCreate: 'infra/functions/src/migrate.handler',
    onUpdate: 'infra/functions/src/migrate.handler',
  });

  const site = new NextjsSite(stack, 'site', {
    bind: [rds],
    customDomain: deployed ? nextCustomDomain : undefined,
    path: 'apps/site',
    // Pass in our environment variables
    environment: {
      NEXT_PUBLIC_API_URL: 'muckrat.com',
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
    RDS_ARN: rds.clusterArn,
    RDS_SECRET: rds.secretArn,
    RDS_DATABASE: rds.defaultDatabaseName,
  });

  // Show the url in the output
  const nextStageUrl = deployed ? `https://${nextDomain}` : site.url;
  stack.addOutputs({
    NextHost: site.url,
    NextStageUrl: nextStageUrl,
  });

  return {
    nextSite: site,
    nextStageUrl,
  };
}

export default {
  config(_input) {
    return {
      name: 'dank',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(WebSiteStack);
  },
} satisfies SSTConfig;
