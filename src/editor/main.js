require("./dependencies");

import HexletIdeWidget from "editor/lib/HexletIdeWidget";

var key = require("keymaster");

key.filter = function() {
  return true;
};

var HexletIde = {
  create: function(domElement: any, options: any) : HexletIdeWidget {
    return new HexletIdeWidget(domElement, options);
  }
};

if (typeof window !== "undefined") {
  window.HexletIde = HexletIde;
}
if (typeof module !== "undefined") {
  module.exports = HexletIde;
}
