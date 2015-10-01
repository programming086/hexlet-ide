/* global process require */

var gulp = require("gulp");
var mainBowerFiles = require('main-bower-files');
var webpack = require("webpack-stream");
var nodemon = require("gulp-nodemon");
var eslint = require("gulp-eslint");

var webpackConfig = require("./webpack.config.js");
var nodemonConfig = require("./nodemon.json");

// var $ = require("gulp-load-plugins")();
gulp.task("default", ["develop"]);

gulp.task('fa-copy', function() {
  return gulp.src('./node_modules/font-awesome/fonts/*')
  .pipe(gulp.dest('src/backend/public/fonts'));
});

gulp.task("webpack", function() {
  return gulp.src("./src/editor/main.js")
  .pipe(webpack(webpackConfig()))
  .pipe(gulp.dest("src/backend/public/assets"));
});

gulp.task("assets", ["fa-copy"], function() {
  process.env.NODE_ENV = "production";
  require("./src/backend/asset.js").manifestCompiler();
});

gulp.task("prepublish", function() {
  process.env.NODE_ENV = "prepublish";
  return gulp.src("./src/editor/main.js")
  .pipe(webpack(webpackConfig()))
  .pipe(gulp.dest("src/backend/public/assets"));
});

gulp.task("develop", ["fa-copy"], function() {
  process.env.NODE_ENV = "develop";
  process.env.HEXLET_IDE_PORT = 9000;
  process.env.TEST_DIR = "test/fixtures/project";
  nodemon(nodemonConfig);
});

gulp.task("lint", function() {
  return gulp.src(["src/**/*.js", "!src/backend/public/**/*"])
    .pipe(eslint())
    .pipe(eslint.format());
});
