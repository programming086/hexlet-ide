import when from "when";
import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

import IdeStore from "editor/stores/IdeStore";
import TreeStore from "editor/stores/TreeStore";
import EditorsStore from "editor/stores/EditorsStore";
import {save} from "editor/actions/EditorsActions";

import rpc from "editor/lib/RpcClient";

export function initIde(data) {
  dispatch(ActionTypes.IDE_INIT, { data: data });
}

export function globalClick() {
  dispatch(ActionTypes.IDE_GLOBAL_CLICK);
}

export function loadCompleted() {
  dispatch(ActionTypes.IDE_LOADED);
}

export function forceConnect() {
  rpc.forceReconnect();
}

export function connect() {
  const msg = { cmd: "ide:connect" };
  window.parent.postMessage(msg, "*");
  dispatch(ActionTypes.IDE_CONNECTED);
}

export function reconnectAttempt() {
  const msg = { cmd: "ide:reconnect_attempt" };
  window.parent.postMessage(msg, "*");

  dispatch(ActionTypes.IDE_RECONNECT_ATTEMPT);
}

export function reconnecting(number) {
  const msg = { cmd: "ide:reconnecting" };
  window.parent.postMessage(msg, "*");
  dispatch(ActionTypes.IDE_RECONNECTING, { attempt: number });
}

export function reconnectError(error) {
  const msg = { cmd: "ide:reconnect_error" };
  window.parent.postMessage(msg, "*");
  dispatch(ActionTypes.IDE_RECONNECT_ERROR, { error: error });
}

export function disconnect() {
  const msg = { cmd: "ide:disconnect" };
  window.parent.postMessage(msg, "*");
  dispatch({ actionType: ActionTypes.IDE_DISCONNECTED });
}

export function showReadme() {
  const readme = IdeStore.getReadme();
  dispatch(ActionTypes.IDE_SHOW_README, { title: "README.md", content: readme });
}

export function run() {
  dispatch(ActionTypes.IDE_RUN);
  const editors = EditorsStore.getAllUnsaved();
  const promises = editors.map(save).toArray();

  when.all(promises).then((_resp) => {
    return rpc.getClient().run.exec("timeout -s SIGTERM -k 20 15 make test");
  }).then((response) => {
    const result = {
      cmd: "ide:run_finish",
      response: response
    };
    window.parent.postMessage(result, "*");
  });
}

export function runProgress(data) {
  dispatch(ActionTypes.IDE_RUN_PROGRESS, { chunk: data });
}

export function runFinished(data) {
  dispatch(ActionTypes.IDE_RUN_FINISH, { code: data.code, signal: data.signal });
}

export function resizeSplit() {
  dispatch(ActionTypes.IDE_RESIZE_SPLIT);
}

export function submitResult() {
  const msg = { cmd: "ide:submit" };
  window.parent.postMessage(msg, "*");
  dispatch(ActionTypes.IDE_SUBMIT_RESULT);
}

export function switchDisplayMode(displayMode) {
  dispatch(ActionTypes.IDE_SWITCH_DISPLAY_MODE, { displayMode: displayMode });
}
