const withImages = require("next-images");
const withYAML = require("next-yaml");
const { withSentryConfig } = require("@sentry/nextjs");

let config = {};

config = {
  ...config,
  sassOptions: {
    prependData: `
@use "sass:math";
@import "styles/palettes.scss";
@import "styles/theme.scss";
@import "styles/mixins.scss";
    `,
  },
};

config = {
  ...config,
  images: {
    path: "",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

config = withImages(config);

config = withYAML(config);

// Sentry configuration - only active in production with proper DSN
config = withSentryConfig(config, {
  // Suppress Sentry logs during build
  silent: true,
  
  // Hide source maps in production for security
  hideSourceMaps: true,
  
  // Disable automatic release creation (avoids auth errors)  
  dryRun: process.env.NODE_ENV !== 'production',
  
  // Only enable webpack plugins if Sentry is properly configured
  disableServerWebpackPlugin: !process.env.SENTRY_DSN,
  disableClientWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Additional Sentry webpack plugin options
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});

module.exports = config;
