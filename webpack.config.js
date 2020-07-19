const path = require("path");

// Default to production unless we know for sure we are in dev
const IS_PRODUCTION = process.env.NODE_ENV !== "dev";

const webpackConfig = {
  mode: IS_PRODUCTION ? "production" : "development",

  entry: {
    index: [path.resolve(path.join(__dirname, "./public/index.js"))]
  },

  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    //publicPath: '/_s/l/js/',
    devtoolModuleFilenameTemplate: "[resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[resource-path]?[hash]"
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  }
};

if (IS_PRODUCTION) {
  webpackConfig.devtool = "source-map";
} else {
  // See http://webpack.github.io/docs/configuration.html#devtool
  webpackConfig.devtool = "cheap-source-map";
  webpackConfig.cache = true;
}

module.exports = webpackConfig;
