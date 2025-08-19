// Edge Runtime Sentry configuration for middleware
// This prevents OpenTelemetry conflicts in Next.js Edge Runtime
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#edge-runtime

import * as Sentry from '@sentry/nextjs';

// Only initialize in production and only for error capture (no performance monitoring)
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Disable performance monitoring in Edge Runtime to avoid conflicts
    tracesSampleRate: 0,
    
    // Minimal configuration for Edge Runtime
    integrations: [],
    
    // Filter out middleware noise
    beforeSend(event, hint) {
      // Only capture actual errors, not blocked requests
      if (event.exception) {
        return event;
      }
      return null;
    },
    
    initialScope: {
      tags: {
        component: 'edge',
        runtime: 'edge',
      },
    },
  });
}