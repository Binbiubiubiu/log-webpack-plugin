const path = require("path");
var LogWebpackPlugin = require("../index");

module.exports = {
  mode: "development",
  entry: "./example/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {},
  plugins: [new LogWebpackPlugin("test options")]
};
