/* global require module */
import _ from "lodash";

import AppDispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

var BaseStore = require("./BaseStore");

var editors = [];

var EditorsStore = BaseStore.extend({
  getAll() {
    return editors;
  },

  getAllUnsaved() {
    return _.filter(editors, function(editor) {
      return editor.lastSavingAt < editor.lastModifiedAt;
    });
  },

  getCurrent() {
    return _.find(editors, { current: true });
  },

  isRunViewActive() {
    return !_.find(editors, (e) => { return e.current == true });
  }
});

AppDispatcher.registerHandler(ActionTypes.TREE_OPEN_FILE, function(payload) {
  editors.map(function(t) { t.current = false; });

  var item = payload.item;
  var content = payload.content;

  var editor = _.find(editors, {id: item.id});
  if (!editor) {
    editors.push({id: item.id, dirty: false, name: item.name, current: true, content: content, lastEditedAt: new Date(), lastSavingAt: new Date()});
  } else {
    editor.current = true;
  }

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.EDITORS_EDIT_CURRENT, function(payload) {
  var editor = _.find(editors, {id: payload.id});
  editor.content = payload.content;
  editor.dirty = true;
  editor.lastModifiedAt = new Date();

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.EDITORS_SAVING_CURRENT, function(payload) {
  var editor = _.find(editors, {id: payload.id});
  editor.lastSavingAt = new Date();

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.EDITORS_SAVE_CURRENT, function(payload) {
  var editor = _.find(editors, {id: payload.id});
  editor.dirty = false;

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.EDITORS_MAKE_CURRENT, function(payload) {
  editors.map(function(t) { t.current = false; });

  var editor = _.find(editors, {id: payload.id});
  editor.current = true;

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.KEY_CTRL_OPEN_SQUARE_BR, function(payload) {
  if (editors.length === 0) return;
  var idx = _.findIndex(editors, {id: EditorsStore.getCurrent().id});
  var newIdx = idx;
  if (idx == 0) {
    newIdx = editors.length - 1;
  } else {
    newIdx = idx - 1;
  }

  editors.map(function(t) { t.current = false; });

  const editor = editors[newIdx];
  editor.current = true;

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.KEY_CTRL_CLOSE_SQUARE_BR, function(payload) {
  if (editors.length === 0) return;
  var idx = _.findIndex(editors, {id: EditorsStore.getCurrent().id});
  var newIdx = idx;
  if (idx == editors.length - 1) {
    newIdx = 0;
  } else {
    newIdx = idx + 1;
  }

  editors.map(function(t) { t.current = false; });

  const editor = editors[newIdx];
  editor.current = true;

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.EDITORS_CLOSE, function(payload) {
  const removedEditor = _.find(editors, { id: payload.id });

  editors = _.filter(editors, function(t) { return t.id !== payload.id; });

  if (removedEditor.current && editors.length > 0) {
    var editor = _.last(editors);
    editor.current = true;
  }

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.EDITORS_SHOW_RUN_VIEW, function(payload) {
  editors.map((editor) => editor.current = false);

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_RUN, function(payload) {
  editors.map((editor) => editor.current = false);

  EditorsStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.TREE_REMOVE, function(payload) {
  var currentEditor = EditorsStore.getCurrent();

  var removedFiles = payload.removedFiles;
  editors = _.filter(editors, function(t) { return !_.contains(removedFiles, t.id); });

  var needSelectNewEditor = !_.contains(editors, currentEditor) && editors.length > 0;

  if (needSelectNewEditor) {
    var editor = _.last(editors);
    editor.current = true;
  }

  EditorsStore.emitChange();
});

// AppDispatcher.registerHandler(ActionTypes.TABS_FLUSH_CONTENT, function(payload) {
//   tab = tabs[payload.id];
//   if (tab !== undefined) {
//     tabs[payload.id].content = payload.content;
//   }
// });

module.exports = EditorsStore;
