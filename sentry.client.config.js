// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
  Sentry.init({
    dsn: SENTRY_DSN || 'https://3ce68c63823641db95d7bd65d08db5d8@o932861.ingest.sentry.io/5881803',
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Handle network errors gracefully (ad blockers, etc.)
    beforeSend(event, hint) {
      // Don't send events if we're in development and not explicitly enabled
      if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'true') {
        return null;
      }
      return event;
    },
    
    // Reduce noise from blocked requests
    integrations: [
      new Sentry.BrowserTracing({
        // Don't create spans for requests that are likely to be blocked
        traceFetch: false,
        traceXHR: false,
      }),
    ],
    
    // Filter out noise from ad blockers
    ignoreErrors: [
      // Network errors that occur when requests are blocked
      'NetworkError',
      'fetch',
      'ERR_BLOCKED_BY_CLIENT',
      'ERR_NETWORK',
      'Failed to fetch',
    ],
    
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}
