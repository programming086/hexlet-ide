require("./dependencies");

import HexletIdeWidget from "editor/lib/HexletIdeWidget";

var key = require("keymaster");

key.filter = function(event) {
  return true;
}
var HexletIde = {
  create: function(domElement, options) {
    return new HexletIdeWidget(domElement, options);
  }
};

if (typeof window !== "undefined") {
  window.HexletIde = HexletIde;
}
if (typeof module !== "undefined") {
  module.exports = HexletIde;
}
