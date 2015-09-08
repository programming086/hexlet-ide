import _ from "lodash";

import {dispatch, promiseDispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

var TerminalsStore = require("editor/stores/TerminalsStore");

import rpc from "editor/lib/RpcClient";

export default {
  createTerminal(params) {
    const id = TerminalsStore.getNextSequence();
    const options = _.merge({ id: id }, params);

    dispatch(ActionTypes.TERMINALS_CREATE_TERMINAL, { id: id, params: params });
    rpc.getClient().terminal.create(options);
  },

  createDefaultTerminal(params) {
    const id = TerminalsStore.getNextSequence();
    const options = _.merge({ id: id}, params);

    dispatch(ActionTypes.TERMINALS_CREATE_TERMINAL, { id: id, params: params });
    rpc.getClient().terminal.createDefault(options);
  },

  reconnectTerminals() {
    _.each(TerminalsStore.getAll(), (terminal) => {
      rpc.getClient().terminal.reconnect({ id: terminal.id });
    });
  },

  runCommandInNewTerminal(cmd, params) {
    const id = TerminalsStore.getNextSequence();
    const options = _.merge({ id: id }, params);
    cmd = "timeout -s SIGTERM -k 20 15 " + cmd;

    dispatch(ActionTypes.TERMINALS_CREATE_TERMINAL, { id: id, params: params });

    rpc.getClient().terminal.create(options).then(() => {
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
    dispatch(ActionTypes.TERMINALS_UPDATE_TERMINAL, { id: msg.id, data: msg.data });
  },

  selectTerminal(terminal) {
    dispatch(ActionTypes.TERMINALS_SELECT_TERMINAL, { id: terminal.id });
  },

  closeTerminal(terminal) {
    const handler = promiseDispatch(ActionTypes.TERMINALS_CLOSE_TERMINAL, { id: terminal.id });
    rpc.getClient().terminal.destroy({id: terminal.id }).then(handler);
  },

  resize(msg) {
    rpc.getClient().terminal.resize(msg);
  },

  showRunView() {
    dispatch(ActionTypes.TERMINALS_SHOW_RUN_VIEW);
  }
};
