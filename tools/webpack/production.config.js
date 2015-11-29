var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    "./src/editor/main"
  ],
  output: {
    path: path.join(__dirname, "../../dist/js"),
    filename: "main.js",
    publicPath: "/assets/"
  },

  debug: false,
  devtool: false,

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
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
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ["babel?stage=0"]
    }, {
      test: /\.(png|svg|woff|woff2|eot|ttf|otf)$/,
      loader: "url?limit=100000"
    }]
  }
};
