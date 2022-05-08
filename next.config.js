const withYAML = require("next-yaml");
const withPWA = require("next-pwa");
const { withSentryConfig } = require("@sentry/nextjs");

let config = {
  images: {
    domains: [
      "3b1b-posts.us-east-1.linodeobjects.com",
      "img.youtube.com",
      "ws-na.amazon-adsystem.com",
      "upload.wikimedia.org",
      "wallpaperaccess.com",
    ],
  },
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

config = withYAML(config);

config = withPWA({
  ...config,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    scope: "/",
    // Must include public excludes otherwise
    // the PWA will entirely fill the user's storage
    // with ALL the lesson data on a separate thread.
    publicExcludes: ["!*.mp4", "!content/**/*"],
  },
});

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
if (process.env.NODE_ENV === "production") {
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
}

module.exports = config;
