module.exports = {
  treeOptions: {
    modelComparatorFn: function(a, b) {
      if (a.type === "directory" && b.type === "file") {
        return -1;
      } else if (b.type === "directory" && a.type === "file") {
        return 1;
      } else if (a.type === "directory" && b.type === "directory") {
        return a.name.localeCompare(b.name);
      } else {
        // FIXME sort names
        return 0;
      }
    }
  }
};
