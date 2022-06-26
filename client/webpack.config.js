const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const webpack = require("webpack");

module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  output: {
    filename: "[name].pack.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
    // Or, for WebPack 4+:
    // new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
  ],
  module: {
    rules: [
      {
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/react", "@babel/env"],
            // "plugins": [
            //     "@babel/plugin-proposal-class-properties"
            // ]
          },
        },
        exclude: /node_modules/,
        test: /\.js$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  entry: {
    index: "./src/index",
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
