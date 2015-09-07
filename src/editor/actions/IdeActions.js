import when from "when";
import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

var IdeStore = require("editor/stores/IdeStore");
var TreeStore = require("editor/stores/TreeStore");
var EditorsStore = require("editor/stores/EditorsStore");
var EditorsActions = require("editor/actions/EditorsActions");

const rpc = require("editor/lib/RpcClient");

export default {
  init(data) {
    dispatch({
      actionType: ActionTypes.IDE_INIT,
      data: data
    });
  },

  globalClick() {
    dispatch({
      actionType: ActionTypes.IDE_GLOBAL_CLICK
    });
  },

  loadCompleted() {
    dispatch({
      actionType: ActionTypes.IDE_LOADED
    });
  },

  forceConnect() {
    rpc.forceReconnect();
  },

  connect() {
    const msg = { cmd: "ide:connect" };
    window.parent.postMessage(msg, "*");
    dispatch({
      actionType: ActionTypes.IDE_CONNECTED
    });
  },

  reconnectAttempt() {
    const msg = { cmd: "ide:reconnect_attempt" };
    window.parent.postMessage(msg, "*");

    dispatch({ actionType: ActionTypes.IDE_RECONNECT_ATTEMPT });
  },

  reconnecting(number) {
    const msg = { cmd: "ide:reconnecting" };
    window.parent.postMessage(msg, "*");
    dispatch({ actionType: ActionTypes.IDE_RECONNECTING, attempt: number });
  },

  reconnectError(error) {
    const msg = { cmd: "ide:reconnect_error" };
    window.parent.postMessage(msg, "*");
    dispatch({ actionType: ActionTypes.IDE_RECONNECT_ERROR, error: error });
  },

  disconnect() {
    const msg = { cmd: "ide:disconnect" };
    window.parent.postMessage(msg, "*");
    dispatch({ actionType: ActionTypes.IDE_DISCONNECTED });
  },

  showReadme() {
    const readme = IdeStore.getReadme();
    dispatch({
      actionType: ActionTypes.IDE_SHOW_README,
      title: "README.md",
      content: readme
    });
  },

  run() {
    dispatch({ actionType: ActionTypes.IDE_RUN });
    const editors = EditorsStore.getAllUnsaved();
    const promises = editors.map(EditorsActions.save);

    when.all(promises).then((_resp) => {
      return rpc.getClient().run.exec("timeout -s SIGTERM -k 20 15 make test");
    }).then((response) => {
      const result = {
        cmd: "ide:run_finish",
        response: response
      };
      window.parent.postMessage(result, "*");
    });
  },

  runProgress(data) {
    dispatch({
      actionType: ActionTypes.IDE_RUN_PROGRESS,
      chunk: data
    });
  },

  runFinished(data) {
    dispatch({
      actionType: ActionTypes.IDE_RUN_FINISH,
      code: data.code,
      signal: data.signal
    });
  },

  resizeSplit() {
    dispatch({
      actionType: ActionTypes.IDE_RESIZE_SPLIT
    });
  },

  submitResult() {
    const msg = { cmd: "ide:submit" };
    window.parent.postMessage(msg, "*");
    dispatch({
      actionType: ActionTypes.IDE_SUBMIT_RESULT
    });
  },

  switchDisplayMode(displayMode) {
    dispatch({
      actionType: ActionTypes.IDE_SWITCH_DISPLAY_MODE,
      displayMode: displayMode
    });
  }
};
