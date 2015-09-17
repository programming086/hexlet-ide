/* global require module */
import _ from "lodash";

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

import {ReduceStore} from 'flux/utils';

import Immutable from 'immutable';

import BaseStore from "./BaseStore";

class EditorsStore extends ReduceStore {
  getInitialState() {
    return Immutable.fromJS({
      editors: []
    });
  }

  areEqual() {
    return false;
  }

  getAll() {
    return this.getState().get('editors');
  }

  getAllUnsaved() {
    return this.getAll().filter((editor) => {
      return editor.lastSavingAt < editor.lastModifiedAt;
    });
  }

  getCurrent() {
    return this.getAll().find((v) => { return v.get('current') == true });
  }

  isRunViewActive() {
    return !this.getAll().find((v) => { return v.get('current') == true });
  }

  reduce(state, action) {
    return this.handleAction(state, action);
  }

  handleAction(state, action) {
    const handler = EditorsStore.handlers[action.actionType];
    if (handler) {
      return handler.call(this, state, action);
    }
    return state;
  }

  static handlers = {
    [ActionTypes.TREE_OPEN_FILE]: function(state, action) {
      var item = action.item;
      var content = action.content;
      var editor = this.getAll().find((v) => { return v.get('id') == item.id});

      if (!editor) {
        return state.update('editors', (v) => {
          return v.map((s) => {
            return s.set('current', false);
          })
          .push(Immutable.fromJS({
            id: item.id,
            dirty: false,
            name: item.name,
            current: true,
            content: content,
            lastEditedAt: new Date(),
            lastSavingAt: new Date()
          }))})
      } else {
        var idx = this.getAll().indexOf(editor);

        return state.update('editors', (v) => {
          return v.map((s) => {
            return s.set('current', false);
          })}).setIn(['editors', idx, "current"], true)
      };
    },

    [ActionTypes.EDITORS_EDIT_CURRENT]: function(state, action) {
      var idx = this.getAll().findIndex((v) => { return v.get('id') === action.item.id});

      return state.setIn(['editors', idx, "content"], action.content)
      .setIn(['editors', idx, "dirty"], true)
      .setIn(['editors', idx, "lastModifiedAt"], new Date());
    },

    [ActionTypes.EDITORS_SAVING_CURRENT]: function(state, action) {
      var idx = this.getAll().findIndex((v) => { return v.get('id') === action.item.id});

      return state.setIn(['editors', idx, "lastSavingAt"], new Date());
    },

    [ActionTypes.EDITORS_SAVE_CURRENT]: function(state, action) {
      var idx = this.getAll().findIndex((v) => { return v.get('id') === action.item.id});

      return state.setIn(['editors', idx, "dirty"], false);
    },

    [ActionTypes.EDITORS_MAKE_CURRENT]: function(state, action) {
      var idx = this.getAll().findIndex((v) => { return v.get('id') === action.id});

      return state.update('editors', (v) => {
        return v.map((s) => {
          return s.set('current', false);
        })
      }).setIn(['editors', idx, "current"], true);
    },

    [ActionTypes.KEY_CTRL_OPEN_SQUARE_BR]: function(state, action) {
      var editors = this.getAll();
      if (editors.size === 0) return;

      var idx = editors.indexOf(this.getCurrent());
      var newIdx = idx;
      if (idx == 0) {
        newIdx = editors.size - 1;
      } else {
        newIdx = idx - 1;
      }

      return state.update('editors', (v) => {
        return v.map((s) => {
          return s.set('current', false);
        })
      }).setIn(['editors', newIdx, "current"], true);
    },

    [ActionTypes.KEY_CTRL_CLOSE_SQUARE_BR]: function(state, action) {
      var editors = this.getAll();
      if (editors.size === 0) return;

      var idx = editors.indexOf(this.getCurrent());
      var newIdx = idx;
      if (idx == editors.size - 1) {
        newIdx = 0;
      } else {
        newIdx = idx + 1;
      }

      return state.update('editors', (v) => {
        return v.map((s) => {
          return s.set('current', false);
        })
      }).setIn(['editors', newIdx, "current"], true);
    },

    [ActionTypes.EDITORS_CLOSE]: function(state, action) {
      var editors = this.getAll();
      var removedEditor = editors.find((v) => { return v.get('id') == action.id});
      var otherEditors = editors.filter((t) => { return t.get('id') !== action.id; });

      if (removedEditor.get('current') && otherEditors.size > 0) {
        var idx = otherEditors.findLastIndex(() => {return true})
        return state.update('editors', (v) => {
          return v.filter((t) => { return t.get('id') !== action.id })})
          .setIn(['editors', idx, "current"], true);
      } else {
        return state.update('editors', (v) => {
          return v.filter((t) => { return t.get('id') !== action.id })})
      }
    },

    [ActionTypes.EDITORS_SHOW_RUN_VIEW]: function(state, action) {
      var editors = this.getAll();
      return state.update('editors', (v) => {
        return v.map((s) => {
          return s.set('current', false);
        })})
    },

    [ActionTypes.IDE_RUN]: function(state, action) {
      var editors = this.getAll();
      return state.update('editors', (v) => {
        return v.map((s) => {
          return s.set('current', true);
        })})
    },

    [ActionTypes.TREE_REMOVE]: function(state, action) {
      var currentEditor = this.getCurrent();
      var editors = this.getAll();
      var removedFiles = action.removedFiles;

      var removedEditors = editors.filter((t) => { return !_.contains(removedFiles, t.get('id')); });
      var needSelectNewEditor = removedEditors.contains(currentEditor) && removedEditors.size > 0;
      var idx = -1;

      if (needSelectNewEditor) {
        var editor = removedEditors.last();
        idx = editors.indexOf(editor);
      }

      return state.update('editors', (v) => {
        return v.filter((t) => { return t.get('id') !== action.id })})
        .setIn(['editors', idx, "current"], true);
    }
  }
}

export default new EditorsStore(dispatcher);
