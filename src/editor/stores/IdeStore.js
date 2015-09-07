import keyMirror from "react/lib/keyMirror";

import AppDispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

const BaseStore = require("./BaseStore");

const IDE_CONNECTION_STATES = keyMirror({
  connected: null,
  disconnected: null,
  reconnectAttempt: null,
  reconnecting: null,
  reconnectError: null
});

var state = {
  loaded: false,
  displayMode: "normal", // "normal" | "terminal"
  readme: "",
  connectionState: IDE_CONNECTION_STATES.disconnected,
  reconnectionAttempt: 0,
  reconnectionError: null
};

var IdeStore = BaseStore.extend({
  isConnected() {
    return state.connectionState === IDE_CONNECTION_STATES.connected;
  },

  getState() {
    return state;
  },

  getReadme() {
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
  state.fullscreen = payload.fullscreen;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_DISCONNECTED, function() {
  state.connectionState = IDE_CONNECTION_STATES.disconnected;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_CONNECTED, function() {
  state.connectionState = IDE_CONNECTION_STATES.connected;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_RECONNECT_ATTEMPT, function() {
  state.connectionState = IDE_CONNECTION_STATES.reconnectAttempt;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_RECONNECTING, function(payload) {
  state.connectionState = IDE_CONNECTION_STATES.reconnecting;
  state.reconnectionAttempt = payload.attempt;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_RECONNECT_ERROR, function(payload) {
  state.connectionState = IDE_CONNECTION_STATES.reconnectError;
  state.reconnectionError = payload.reconnectionError;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_SWITCH_DISPLAY_MODE, function(payload) {
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
