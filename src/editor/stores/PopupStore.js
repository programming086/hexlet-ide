/* global require module */
var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var BaseStore = require("./BaseStore");
var ActionTypes = require("editor/constants/IdeConstants").ActionTypes;

var state = {
  type: "",
  options: {},
  isOpened: false
};

function open(state, type, options) {
  state.type = type;
  state.options = options;
  state.isOpened = true;

  return state;
}

function close(state) {
  state.isOpened = false;
  state.type = "";
  state.options = {};
  return state;
}

var PopupStore = BaseStore.extend({
  getType() {
    return state.type;
  },

  getOptions() {
    return state.options;
  },

  isOpened() {
    return state.isOpened;
  }
});

AppDispatcher.registerHandler(ActionTypes.POPUP_OPEN, function(payload) {
  state = open(state, payload.type, payload.options);

  PopupStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.POPUP_CLOSE, function() {
  state = close(state);
  PopupStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.TREE_CREATE_FOLDER, function() {
  state = close(state);
  PopupStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.TREE_CREATE_FILE, function() {
  state = close(state);
  PopupStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.TREE_REMOVE, function() {
  state = close(state);
  PopupStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.TREE_RENAME, function() {
  state = close(state);
  PopupStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_SHOW_README, function(payload) {
  state = open(state, "markdown_view", {
    content: payload.content,
    title: payload.title
  });

  PopupStore.emitChange();
});

module.exports = PopupStore;
