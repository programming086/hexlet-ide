import _ from "lodash";

import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

var TerminalsStore = require("editor/stores/TerminalsStore");

import rpc from "editor/lib/RpcClient";

export default {
  createTerminal(params) {
    const id = TerminalsStore.getNextSequence();
    dispatch({
      actionType: ActionTypes.TERMINALS_CREATE_TERMINAL,
      id: id,
      params: params
    });

    const options = _.merge({ id: id}, params);
    rpc.getClient().terminal.create(options);
  },

  createDefaultTerminal(params) {
    const id = TerminalsStore.getNextSequence();
    dispatch({
      actionType: ActionTypes.TERMINALS_CREATE_TERMINAL,
      id: id,
      params: params
    });

    const options = _.merge({ id: id}, params);
    rpc.getClient().terminal.createDefault(options);
  },

  reconnectTerminals() {
    _.each(TerminalsStore.getAll(), function(terminal) {
      rpc.getClient().terminal.reconnect({ id: terminal.id });
    });
  },

  runCommandInNewTerminal(cmd, params) {
    const id = TerminalsStore.getNextSequence();
    dispatch({
      actionType: ActionTypes.TERMINALS_CREATE_TERMINAL,
      id: id,
      params: params
    });

    const options = _.merge({ id: id }, params);
    cmd = "timeout -s SIGTERM -k 20 15 " + cmd;
    rpc.getClient().terminal.create(options).then(function() {
      rpc.getClient().terminal.update({ id: id, data: cmd + "\n" });
    });
  },

  runCommand(terminal, cmd) {
    cmd = "timeout -s SIGTERM -k 20 15 " + cmd;
    rpc.getClient().terminal.update({ id: terminal.id, data: cmd + "\n" });
  },

  startUpdateTerminal(msg) {
    rpc.getClient().terminal.update(msg);
  },

  finishUpdateTerminal(msg) {
    dispatch({
      actionType: ActionTypes.TERMINALS_UPDATE_TERMINAL,
      id: msg.id,
      data: msg.data
    });
  },

  selectTerminal(terminal) {
    dispatch({
      actionType: ActionTypes.TERMINALS_SELECT_TERMINAL,
      id: terminal.id
    });
  },

  closeTerminal(terminal) {
    rpc.getClient().terminal.destroy({id: terminal.id }).then(function() {
      dispatch({
        actionType: ActionTypes.TERMINALS_CLOSE_TERMINAL,
        id: terminal.id
      });
    });
  },

  resize(msg) {
    rpc.getClient().terminal.resize(msg);
  },

  showRunView() {
    dispatch({
      actionType: ActionTypes.TERMINALS_SHOW_RUN_VIEW
    });
  }
};
