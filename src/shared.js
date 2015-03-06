/* global module */

module.exports = {
  treeOptions: {
    modelComparatorFn: function(a, b) {
      if (a.type === "directory" && b.type === "file") {
        return -1;
      } else if (b.type === "directory" && a.type === "file") {
        return 1;
      } else {
        // FIXME sort names
        return 0;
      }
    }
  }
};
