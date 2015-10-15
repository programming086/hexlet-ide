/* global process require */

var gulp = require("gulp");
var webpack = require("webpack-stream");
var nodemon = require("gulp-nodemon");

var webpackDevConfig = require("./tools/webpack/development.config");
var webpackProdConfig = require("./tools/webpack/production.config");
var nodemonConfig = require("./nodemon.json");

gulp.task("default", ["develop"]);

gulp.task('fa-copy', function() {
  return gulp.src('./node_modules/font-awesome/fonts/*')
  .pipe(gulp.dest('./dist/fonts'));
});

gulp.task("assets", ["fa-copy"], function() {
  require("./tools/mincer/asset.js").manifestCompiler();
});

gulp.task("develop", ["fa-copy"], function() {
  nodemon(nodemonConfig);
});
