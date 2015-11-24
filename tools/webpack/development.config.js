var path = require("path");
var webpack = require("webpack");

module.exports = {
  debug: true,
  devtool: "inline-source-map",

  entry: [
    "webpack-hot-middleware/client",
    "./src/editor/main",
  ],

  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/public/js"
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    modulesDirectories: [
      "src", "node_modules", "bower_components"
    ]
  },

  resolveLoader: { root: path.join(__dirname, "node_modules") },

  externals: {
    "jquery": "jQuery",
    "react/addons": "React",
    "react": "React",
    "react-dom": "ReactDOM"
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ],

    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ["babel"]
    }, {
      test: /\.(png|svg|woff|woff2|eot|ttf|otf)$/,
      loader: "url?limit=100000"
    }]
  }
};
