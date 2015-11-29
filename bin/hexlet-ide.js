#!/usr/bin/env node --harmony

/* global require process console */

var fs = require("fs");
var path = require("path");

var program = require("commander");

program
.option("-p, --port [num]", "Port", process.env.HEXLET_IDE_PORT || 8080)
.option("-r, --root-dir [path]", "Root directory", process.cwd())
.option("-a, --app-dir [path]", "Root directory", process.cwd())
.parse(process.argv);

program.rootDir = path.resolve(process.env.TEST_DIR || program.rootDir);
program.appDir = path.resolve(process.env.TEST_DIR || program.appDir);

if (!fs.existsSync(program.rootDir)) {
  throw "Directory :" + program.rootDir + " is not exist!";
}

if (!fs.existsSync(program.appDir)) {
  throw "Directory :" + program.appDir + " is not exist!";
}

console.log("info: Root dir is " + program.rootDir);
console.log("info: App dir is " + program.appDir);

require("../src/backend/server")(program);
