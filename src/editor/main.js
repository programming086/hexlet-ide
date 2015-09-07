require("./dependencies");

import HexletIdeWidget from "editor/lib/HexletIdeWidget";
import key from "keymaster";

key.filter = function() {
  return true;
};

const HexletIde = {
  create(domElement: any, options: any) : HexletIdeWidget {
    return new HexletIdeWidget(domElement, options);
  }
};

if (typeof window !== "undefined") {
  window.HexletIde = HexletIde;
}
if (typeof module !== "undefined") {
  module.exports = HexletIde;
}
