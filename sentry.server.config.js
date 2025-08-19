// Server-side Sentry configuration for API and SSR error monitoring
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry in production
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    // Lower sampling for server-side performance monitoring
    tracesSampleRate: 0.05,
    
    // Enhanced error filtering for server
    beforeSend(event, hint) {
      // Skip if no DSN configured
      if (!process.env.SENTRY_DSN) {
        return null;
      }
      return event;
    },
    
    // Server-specific context
    initialScope: {
      tags: {
        component: 'server',
        site: '3blue1brown',
      },
    },
    
    // Capture additional server context
    integrations: [
      // Avoid BrowserTracing on server to prevent conflicts
    ],
  });
}
