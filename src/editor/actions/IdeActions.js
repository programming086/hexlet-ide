/* global require module window */

var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var IdeConstants = require("editor/constants/IdeConstants");
var IdeStore = require("editor/stores/IdeStore");
var TreeStore = require("editor/stores/TreeStore");
var ActionTypes = IdeConstants.ActionTypes;

var rpc = require("editor/lib/RpcClient");

var IdeActions = {
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

    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_CONNECTED
    });
  },

  disconnect() {
    "use strict";

    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_DISCONNECTED
    });
  },

  showReadme(text) {
    // var item = TreeStore.getFileByName("README.md");
    // rpc.getClient().fs.read(item.path).then(function(result) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.IDE_SHOW_README,
      content: text,
      title: "README.md"
    });
    // });
  },

  run() {
    AppDispatcher.dispatch({ actionType: ActionTypes.IDE_RUN });
    return rpc.getClient().run.exec("make test")
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
  }
};

module.exports = IdeActions;
