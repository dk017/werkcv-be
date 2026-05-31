const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    index: path.resolve(process.cwd(), "blocks/src/index.js"),
  },
  output: {
    ...defaultConfig.output,
    path: path.resolve(process.cwd(), "blocks/build"),
  },
};
