/* global require module */
var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var BaseStore = require("./BaseStore");
var ActionTypes = require("editor/constants/IdeConstants").ActionTypes;

var state = {
  content: "",
  code: 0,
  signal: null
};

var RunViewStore = BaseStore.extend({
  getContent() {
    return state.content;
  },
});

AppDispatcher.registerHandler(ActionTypes.IDE_RUN, function(payload) {
  state.content = "";
  state.code = "";
  state.signal = null;

  RunViewStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_RUN_PROGRESS, function(payload) {
  state.content += payload.chunk;
  RunViewStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_RUN_FINISH, function(payload) {
  state.code = payload.code;
  state.signal = payload.signal;
  RunViewStore.emitChange();
});

module.exports = RunViewStore;

