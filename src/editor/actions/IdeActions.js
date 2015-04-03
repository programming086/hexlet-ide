/* global require module window */

var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var IdeConstants = require("editor/constants/IdeConstants");
var IdeStore = require("editor/stores/IdeStore");
var TreeStore = require("editor/stores/TreeStore");
var ActionTypes = IdeConstants.ActionTypes;

var rpc = require("editor/lib/RpcClient");

var IdeActions = {
  init(data) {
    "use strict";
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_INIT,
      data: data
    });
  },

  globalClick() {
    "use strict";
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_GLOBAL_CLICK
    });
  },

  // toggleFullscreen() {
  //   "use strict";

  //   var fullscreen = !IdeStore.getState().fullscreen;
  //   var cmd = fullscreen ? "ideFullscreen" : "ideEmbedded";
  //   var message = { cmd: cmd };

  //   window.parent.postMessage(message, "*");

  //   AppDispatcher.dispatch({
  //     actionType: ActionTypes.IDE_TOGGLE_FULL_SCREEN,
  //     fullscreen: fullscreen
  //   });
  // },

  loadCompleted() {
    "use strict";

    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_LOADED
    });
  },

  connect() {
    "use strict";

    var msg = { cmd: "ide:connect" };
    window.parent.postMessage(msg, "*");
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_CONNECTED
    });
  },

  disconnect() {
    "use strict";

    var msg = { cmd: "ide:disconnect" };
    window.parent.postMessage(msg, "*");
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_DISCONNECTED
    });
  },

  showReadme() {
    const readme = IdeStore.getReadme();
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_SHOW_README,
      title: "README.md",
      content: readme
    });
  },

  run() {
    AppDispatcher.dispatch({ actionType: ActionTypes.IDE_RUN });
    return rpc.getClient().run.exec("make test").then((response) => {
      var result = {
        cmd: "ide:run_finish",
        response: response
      };
      window.parent.postMessage(result, "*");
    });
  },

  runProgress(data) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_RUN_PROGRESS,
      chunk: data
    });
  },

  runFinished(data) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_RUN_FINISH,
      code: data.code,
      signal: data.signal
    });
  },

  resizeSplit() {
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_RESIZE_SPLIT
    });
  },

  submitResult() {
    var msg = { cmd: "ide:submit" };
    window.parent.postMessage(msg, "*");
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_SUBMIT_RESULT
    });
  },

  switchDisplayMode(displayMode) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_SWITCH_DISPLAY_MODE,
      displayMode: displayMode
    });
  }
};

module.exports = IdeActions;
