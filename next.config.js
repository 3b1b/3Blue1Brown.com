const withImages = require("next-images");
const withYAML = require("next-yaml");


let config = {
  target: "serverless"
}

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

module.exports = config;
