const path = require("path");

module.exports = {
  target: "node",
  entry: {
    "rate-shipments": "./src/methods/get-rates/demo-carrier-implementation.ts",
  },
  mode: "production",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.webpack.json",
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    libraryTarget: "commonjs2",
    filename: "[name].js",
    path: path.resolve(__dirname, "data/demo-carrier"),
  },
};
