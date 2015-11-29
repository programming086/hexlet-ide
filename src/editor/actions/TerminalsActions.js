import _ from "lodash";

import {dispatch, promiseDispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

import TerminalsStore from "editor/stores/TerminalsStore";

import rpc from "editor/lib/RpcClient";

export function createTerminal(params) {
  const id = TerminalsStore.getNextSequence();
  const options = _.merge({ id: id }, params);

  dispatch(ActionTypes.TERMINALS_CREATE_TERMINAL, { id: id, params: params });
  rpc.getClient().terminal.create(options);
};

export function createDefaultTerminal(params) {
  const id = TerminalsStore.getNextSequence();
  const options = _.merge({ id: id}, params);

  dispatch(ActionTypes.TERMINALS_CREATE_TERMINAL, { id: id, params: params });
  rpc.getClient().terminal.createDefault(options);
};

export function reconnectTerminals() {
  _.each(TerminalsStore.getTerminals(), (terminal) => {
    rpc.getClient().terminal.reconnect({ id: terminal.id });
  });
};

export function runCommandInNewTerminal(cmd, params) {
  const id = TerminalsStore.getNextSequence();
  const options = _.merge({ id: id }, params);
  cmd = "timeout -s SIGTERM -k 20 15 " + cmd;

  dispatch(ActionTypes.TERMINALS_CREATE_TERMINAL, { id: id, params: params });

  rpc.getClient().terminal.create(options).then(() => {
    rpc.getClient().terminal.update({ id: id, data: cmd + "\n" });
  });
};

export function runCommand(terminal, cmd) {
  cmd = "timeout -s SIGTERM -k 20 15 " + cmd;
  rpc.getClient().terminal.update({ id: terminal.id, data: cmd + "\n" });
};

export function startUpdateTerminal(msg) {
  rpc.getClient().terminal.update(msg);
};

export function finishUpdateTerminal(msg) {
  dispatch(ActionTypes.TERMINALS_UPDATE_TERMINAL, { id: msg.id, data: msg.data });
};

export function selectTerminal(terminal) {
  dispatch(ActionTypes.TERMINALS_SELECT_TERMINAL, { id: terminal.id });
};

export function closeTerminal(terminal) {
  const handler = promiseDispatch(ActionTypes.TERMINALS_CLOSE_TERMINAL, { id: terminal.id });
  rpc.getClient().terminal.destroy({id: terminal.id }).then(handler);
}

export function resize(msg) {
  rpc.getClient().terminal.resize(msg);
}

export function showRunView() {
  dispatch(ActionTypes.TERMINALS_SHOW_RUN_VIEW);
};
