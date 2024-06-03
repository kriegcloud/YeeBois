const config = {
  dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: Number(process.env['NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE']),
  maxValueLength: 100000,

  environment: process.env['NODE_ENV'],
  //   attachStacktrace: true,

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
}


export default config;
