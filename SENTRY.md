# Sentry Error Monitoring Setup

Sentry automatically captures JavaScript errors, performance issues, and server-side problems from your production site.

## What Sentry Does for 3Blue1Brown

- **Catches production bugs** users encounter that you don't see locally
- **Monitors site performance** - identifies slow pages and failed requests  
- **Tracks user impact** - shows which errors affect the most users
- **Provides debugging context** - full stack traces, user sessions, and browser info

## Current Status

- ✅ **Updated to Sentry v7** - Modern, Edge Runtime compatible
- ✅ **OpenTelemetry conflicts resolved** - No more middleware errors
- ✅ **Full Next.js integration** - Client, server, and edge runtime support
- ✅ **Production only** - Won't run in development
- ✅ **Ad-blocker filtered** - Ignores noise from blocked requests
- ✅ **Source maps hidden** - Secure production deployment

## Setup (Optional)

Sentry is completely optional. To enable it:

1. **Create a Sentry account** at [sentry.io](https://sentry.io)
2. **Create a Next.js project** in your Sentry dashboard
3. **Add environment variables** to your hosting platform:

```bash
# Required for client-side error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Required for server-side error tracking  
SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional - for release tracking
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

## Benefits You'd Get

**Error Monitoring:**
- JavaScript errors users encounter
- Failed API requests and timeouts
- React component crashes
- Navigation and routing issues

**Performance Insights:**
- Slow page loads and heavy components
- Database query performance  
- Memory usage and bundle size impact
- User session flows and drop-offs

**User Context:**
- Which browsers/devices have issues
- Geographic patterns in errors
- User actions leading to problems
- Error frequency and trends

## No Action Required

- **Works automatically** once environment variables are set
- **Self-contained** - won't affect site functionality if not configured
- **Clean development** - only activates in production
- **Minimal overhead** - samples 10% of transactions for performance

If you prefer not to use error monitoring, simply don't add the environment variables and Sentry will remain inactive.