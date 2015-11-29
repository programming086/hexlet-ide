/* global require module */
import _ from "lodash";

import Immutable from "immutable";
import {ReduceStore} from "flux/utils";

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

import BaseStore from "./BaseStore";
import IdeStore from "./IdeStore";

class TerminalsStore extends ReduceStore {
  getInitialState() {
    return {
      terminals: {},
      terminalSequence: 1
    };
  }

  areEqual(oldState, newState) {
    return false;
  }

  getTerminals() {
    return this.getState().terminals;
  };

  getCurrent() {
    return _.find(this.getState().terminals, "current");
  };

  getNextSequence() {
    return this.getState().terminalSequence++;
  };

  isRunViewActive() {
    return !_.find(this.getState().terminals, (e) => { return e.current == true });
  };

  reduce(state, action) {
    switch(action.actionType) {
      case ActionTypes.TERMINALS_CREATE_TERMINAL:
        this.getState().terminals[action.id] = {
          id: action.id,
          terminal: new Terminal({
            cols: action.params.cols,
            rows: action.params.rows,
          })
        };
        _.each(this.getState().terminals, function(t) { t.current = false; });
        var currentTerminal = this.getState().terminals[action.id];
        currentTerminal.current = true;
        return state;

      case ActionTypes.TERMINALS_UPDATE_TERMINAL:
        const terminal = this.getState().terminals[action.id];
        terminal.terminal.write(action.data);
        return state;

      case ActionTypes.TERMINALS_SELECT_TERMINAL:
        _.each(this.getState().terminals, function(t) { t.current = false; });
        var currentTerminal = this.getState().terminals[action.id];
        currentTerminal.current = true;
        return state;

      case ActionTypes.TERMINALS_CLOSE_TERMINAL:
        var term = this.getState().terminals[action.id];
        delete this.getState().terminals[action.id];
        if (term.current) {
          var terms = _.values(this.getState().terminals);
          if (terms.length > 0) {
            terms[0].current = true;
          }
        }
        return state;

      case ActionTypes.IDE_RESIZE_SPLIT:
        var t = this.getCurrent();
        return state;

      case ActionTypes.TERMINALS_SHOW_RUN_VIEW:
        _.map(this.getState().terminals, (t, id) => { t.current = false });
        return state;

      case ActionTypes.IDE_RUN:
        if (IdeStore.isTerminalMode()) {
          _.map(this.getState().terminals, (t, id) => { t.current = false });
        }
        return state;

      default:
        return state;
    }
  }
};


export default new TerminalsStore(dispatcher);
