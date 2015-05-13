/* global module require __dirname process */

var path = require("path");

function isPrepublish() {
  "use strict";
  return process.env.NODE_ENV === "prepublish";
}


module.exports = function() {
  "use strict";

  return {
    output: {
      publicPath: "/assets/",
      path: path.join(__dirname, "dist"),
      filename: "[name].js"
    },

    cache: isPrepublish() ? false : true,
    debug: isPrepublish() ? false : true,
    devtool: false,
    target: "web",
    entry: {
      main: path.join(__dirname, "./src/editor/main.js")
    },

    devServer: {
      publicPath: "/assets/",
      headers: {
        "Cache-Control": "max-age=315360000"
      }
    },

    resolve: {
      modulesDirectories: [
        "src", "node_modules", "bower_components"
      ]
    },

    resolveLoader: { root: path.join(__dirname, "node_modules") },

    module: {
      loaders: [{
        test: /\.css$/,
        loader: "style!css!autoprefixer-loader"
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        // loader: "babel-loader?experimental&optional=runtime"
        loaders: ["babel?stage=0&optional=validation.undeclaredVariableCheck"]
      }, {
        test: /\.less$/,
        loader: "style!css!autoprefixer!less"
      }, {
        test: /\.(png|svg|woff|woff2|eot|ttf|otf)$/,
        loader: "url?limit=100000"
      }]
    }
  };
};
