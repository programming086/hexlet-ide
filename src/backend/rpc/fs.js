/* global module require */
var path = require("path");
var fs = require("fs-extra");
var TreeModel = require("tree-model");
var rimraf = require("rimraf");
var when = require("when");

var shared = require("../../shared");

module.exports = (options) => {
  return {
    tree(params) {
      function internalTree(basePath, depth) {
        const name = path.basename(basePath);
        const stat = fs.statSync(basePath);

        const item = {
          name: name,
          path: basePath,
          state: depth > 0 ? "opened" : "closed",
          id: stat.ino,
          type: stat.isDirectory() ? "directory" : "file"
        };

        if (stat.isDirectory() && depth > 0) {
          const children = fs.readdirSync(basePath);
          item.children = children.map((item) => {
            const itemPath = path.join(basePath, item);
            const itemDepth = depth - 1;
            return internalTree(itemPath, itemDepth);
          });
        }

        return item;
      }
      const dirPath = params.path ? params.path : options.rootDir;
      const depth = params.depth ? params.depth : 1;

      const rootItem = internalTree(dirPath, depth);
      return rootItem;
    },

    read(path) {
      return fs.readFileSync(path, {encoding: "utf8"});
    },

    touch(filepath) {
      const fullPath = path.join(path.dirname(options.rootDir), filepath);
      if (fs.existsSync(fullPath)) {
        return null;
      }
      fs.writeFileSync(fullPath, "");
      const item = {
        name: path.basename(filepath),
        id: fs.statSync(fullPath).ino,
        type: "file",
        path: fullPath,
        state: "open"
      };
      return item;
    },

    write(filePath, content) {
      const fullPath = path.join(path.dirname(options.rootDir), filePath);
      return fs.writeFileSync(fullPath, content);
    },

    unlink(folder) {
      const fullPath = path.join(path.dirname(options.rootDir), folder);
      return rimraf.sync(fullPath);
    },

    mkdir(folder) {
      const fullPath = path.join(path.dirname(options.rootDir), folder);
      if (fs.existsSync(fullPath)) {
        return null;
      }
      fs.mkdirSync(fullPath);
      const item = {
        name: path.basename(folder),
        id: fs.statSync(fullPath).ino,
        type: "directory",
        path: fullPath,
        state: "closed"
      };
      return item;
    },

    rename(filePath, name) {
      return when.promise((resolve) => {
        const fullPath = path.join(path.dirname(options.rootDir), filePath);
        const newPath = path.join(path.dirname(fullPath), name);
        fs.move(fullPath, newPath, () => {
          const item = {
            id: fs.statSync(newPath).ino,
            path: newPath,
            name: name
          };
          resolve(item);
        });
      });
    }
  };
};
