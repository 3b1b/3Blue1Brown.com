const withImages = require("next-images");
const withYAML = require("next-yaml");
const { withSentryConfig } = require("@sentry/nextjs");

let config = {
  target: "serverless",
};

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

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
config = withSentryConfig(config, {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
});

module.exports = config;
