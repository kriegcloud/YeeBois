import { httpClientIntegration } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';

const config = {
  dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],
  // Replay may only be enabled for the client-side
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
    // @ts-ignore
    httpClientIntegration({ failedRequestStatusCodes: [400, 599] }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: Number(process.env['NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE']),
  //   debug: true,
  //   tracePropagationTargets: ["localhost", /^\//, /http:\/\/localhost:3000\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: Number(
    process.env['NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE'],
  ),
  replaysOnErrorSampleRate: 1.0,
  maxValueLength: 100000,

  environment: process.env.NODE_ENV,

  // This option is required for capturing headers and cookies. (httpClientIntegration)
  sendDefaultPii: true,

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
};

export default config;
