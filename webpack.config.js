const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content: path.join(__dirname, "src/content.ts"),
    popup: path.join(__dirname, "src/popup.ts"),
  },
  output: {
    path: path.join(__dirname, "dist/scripts"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: ".", 
          to: "../",
          context: "public"
        }
      ]
    })
  ],
  devtool: 'cheap-module-source-map',
  cache: true,
  watchOptions:{
    poll: true,
  }
};
