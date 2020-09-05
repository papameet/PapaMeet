const path = require("path");

module.exports = {
  entry: {
    main: "./src/main.js",
    content: "./src/content.js"
  },
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  //devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader'}, "css-loader"],
      },
    ],
  },
};
