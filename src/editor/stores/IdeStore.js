/* global require module */
var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var BaseStore = require("./BaseStore");
var ActionTypes = require("editor/constants/IdeConstants").ActionTypes;

var state = {
  loaded: false,
  displayMode: "normal", // "normal" | "terminal"
  connected: false,
  readme: ""
};

var IdeStore = BaseStore.extend({
  getState() {
    "use strict";
    return state;
  },

  getReadme() {
    "use strict";
    return state.readme;
  },

  isTerminalMode() {
    return state.displayMode === "terminal";
  }
});

AppDispatcher.registerHandler(ActionTypes.IDE_LOADED, function() {
  "use strict";

  state.loaded = true;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_TOGGLE_FULL_SCREEN, function(payload) {
  "use strict";

  state.fullscreen = payload.fullscreen;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_DISCONNECTED, function() {
  "use strict";

  state.connected = false;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_CONNECTED, function() {
  "use strict";

  state.connected = true;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_SWITCH_DISPLAY_MODE, function(payload) {
  "use strict";
  state.displayMode = payload.displayMode;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_INIT, function(payload) {
  "use strict";
  const data = payload.data;
  state.displayMode = data.displayMode;
  state.readme = data.readme;
  IdeStore.emitChange();
});

module.exports = IdeStore;
