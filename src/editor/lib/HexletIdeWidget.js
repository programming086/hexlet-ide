import Mousetrap from "mousetrap";
import React from "react";
import ReactDOM from "react-dom";
import Config from "editor/config";
import Ide from "editor/components/Ide";

import KeyboardActions from "editor/actions/KeyboardActions";

import {
  openFile,
  loadTreeAndOpenFiles
} from "editor/actions/TreeActions";

import {
  finishUpdateTerminal,
  reconnectTerminals
} from "editor/actions/TerminalsActions";

import {
  loadCompleted,
  run,
  initIde,
  switchDisplayMode,
  showReadme,
  runFinished,
  runProgress,
  disconnect,
  connect,
  reconnectError,
  reconnecting,
  reconnectAttempt,
} from "editor/actions/IdeActions";
import {save} from "editor/actions/EditorsActions";

import EditorsStore from "editor/stores/EditorsStore";
import TreeStore from "editor/stores/TreeStore";

import RpcClient from "editor/lib/RpcClient";

export default class HexletIdeWidget {
  constructor(domElement, options) {
    Config.extend(options);

    RpcClient.init(Config.rpc);

    this.domElement = domElement;
    this.cmd = options.cmd;
    this.bindEvents();
    this.runAutosave();
    this.bindKeyEvents();
    this.render();
  }

  bindEvents() {
    const rpcClient = RpcClient.getClient();

    rpcClient.ready((proxy) => {
      loadCompleted();
    });

    //FIXME: это хак, пока не сделано дуплексное RPC между клиентом и сервером
    rpcClient.socket.on("terminalUpdated", (msg) => {
      finishUpdateTerminal(msg);
    });

    rpcClient.socket.on("reconnect_attempt", () => {
      console.log('reconnect_attempt');
      reconnectAttempt();
    });

    rpcClient.socket.on("reconnecting", (attempt) => {
      console.log('reconnecting');
      reconnecting(attempt);
    });

    rpcClient.socket.on("reconnect_error", (error) => {
      console.log('reconnect_error');
      reconnectError(error);
    });


    rpcClient.socket.on("connect", () => {
    console.log('connect');
      connect();
    });

    rpcClient.socket.on("reconnect", () => {
    console.log('reconnect');
      connect();
      reconnectTerminals();
    });

    rpcClient.socket.on("disconnect", () => {
    console.log('disconnect');
      disconnect();
    });

    rpcClient.socket.on("run.progress", (data) => {
      runProgress(data);
    });

    rpcClient.socket.on("run.finish", (data) => {
      runFinished(data);
    });
  }

  runAutosave() {
    this.autosaveTimer = setInterval(() => {
      const editors = EditorsStore.getAllUnsaved();
      editors.forEach(save);
    }, Config.autosaveInterval);
  }

  bindKeyEvents() {
    Mousetrap.bind("esc", KeyboardActions.esc);
    Mousetrap.bind("ctrl+r", run);
    Mousetrap.bind("ctrl+h", showReadme);
    Mousetrap.bind("ctrl+[", KeyboardActions.ctrl_open_square_br);
    Mousetrap.bind("ctrl+]", KeyboardActions.ctrl_close_square_br);
  }

  render() {
    return ReactDOM.render(<Ide cmd={this.cmd} />, this.domElement);
  }

//   runCommand(cmd) {
//     runCommandInNewTerminal(cmd, Config.terminal);
//   }

//   exec() {
//     return RpcClient.getClient().run.exec(cmd);
//   }

  showReadme() {
    return showReadme();
  }

  switchDisplayMode(displayMode) {
    return switchDisplayMode(displayMode);
  }

  init(data) {
    initIde(data);
  }

  run() {
    return run();
  }

  openFile(filePath) {
    const fileNode = TreeStore.getFileByPath(filePath)
    openFile(fileNode);
  }

  openFiles(files) {
    loadTreeAndOpenFiles(files);
  }

  handleWindowMessage(e) {
    const cmd = e.data.cmd;
    const data = e.data.data;

    switch(cmd) {
      case "ide:run":
        return this.run();
      case "ide:readme":
        return this.showReadme();
      case "ide:switch_display_mode":
        return this.switchDisplayMode(data.displayMode);
      case "ide:init":
        return this.init(data);
      case "ide:open_files":
        return this.openFiles(data);
      default:
        return null;
    }
  }
}
