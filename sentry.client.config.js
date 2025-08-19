// Modern Sentry configuration for browser-side error monitoring
// Only runs in production to avoid development noise
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry in production
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Performance monitoring - sample 10% of transactions in production
    tracesSampleRate: 0.1,
    
    // Filter out noise from ad blockers and development
    beforeSend(event, hint) {
      // Don't send events for blocked requests (ad blockers, etc.)
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message).toLowerCase();
        if (message.includes('blocked') || message.includes('network')) {
          return null;
        }
      }
      return event;
    },
    
    // Modern integrations for v7 (Edge Runtime compatible)
    integrations: [
      Sentry.browserTracingIntegration({
        traceFetch: false, // Avoid tracking blocked requests
        traceXHR: false,   // Avoid tracking blocked XHR
      }),
    ],
    
    // Filter out common noise
    ignoreErrors: [
      'NetworkError',
      'ERR_BLOCKED_BY_CLIENT', 
      'ERR_NETWORK',
      'Failed to fetch',
      'Non-Error promise rejection captured', // React dev noise
    ],
    
    // Capture user context for better debugging
    initialScope: {
      tags: {
        component: 'client',
        site: '3blue1brown',
      },
    },
  });
}
