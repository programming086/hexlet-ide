import Mousetrap from "mousetrap";
const React = require("react/addons");
const Config = require("editor/config");
const Ide = require("editor/components/Ide");

const KeyboardActions = require("editor/actions/KeyboardActions");
const TreeActions = require("editor/actions/TreeActions");
const TerminalsActions = require("editor/actions/TerminalsActions");
const IdeActions = require("editor/actions/IdeActions");
const EditorsActions = require("editor/actions/EditorsActions");
const TerminalsStore = require("editor/stores/TerminalsStore");
const EditorsStore = require("editor/stores/EditorsStore");

const RpcClient = require("editor/lib/RpcClient");

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
    var rpcClient = RpcClient.getClient();

    rpcClient.ready((proxy) => {
      TreeActions.loadTree();
      TerminalsActions.createDefaultTerminal(Config.terminal);

      IdeActions.loadCompleted();
      IdeActions.connect();
    });

    //FIXME: это хак, пока не сделано дуплексное RPC между клиентом и сервером
    rpcClient.socket.on("terminalUpdated", (msg) => {
      TerminalsActions.finishUpdateTerminal(msg);
    });

    rpcClient.socket.on("reconnect", () => {
      IdeActions.connect();
      TerminalsActions.reconnectTerminals();
    });

    rpcClient.socket.on("disconnect", () => {
      IdeActions.disconnect();
    });

    rpcClient.socket.on("run.progress", (data) => {
      IdeActions.runProgress(data);
    });

    rpcClient.socket.on("run.finish", (data) => {
      IdeActions.runFinished(data);
    });
  }

  runAutosave() {
    this.autosaveTimer = setInterval(() => {
      var editors = EditorsStore.getAllUnsaved();
      editors.forEach(EditorsActions.save);
    }, Config.autosaveInterval);
  }

  bindKeyEvents() {
    Mousetrap.bind("esc", KeyboardActions.esc);
    Mousetrap.bind("ctrl+r", IdeActions.run);
    Mousetrap.bind("ctrl+h", IdeActions.showReadme);
    Mousetrap.bind("ctrl+[", KeyboardActions.ctrl_open_square_br);
    Mousetrap.bind("ctrl+]", KeyboardActions.ctrl_close_square_br);
  }

  render() {
    return React.render(<Ide cmd={this.cmd} />, this.domElement);
  }

//   runCommand(cmd) {
//     TerminalsActions.runCommandInNewTerminal(cmd, Config.terminal);
//   }

//   exec() {
//     return RpcClient.getClient().run.exec(cmd);
//   }

  showReadme() {
    return IdeActions.showReadme();
  }

  switchDisplayMode(displayMode) {
    return IdeActions.switchDisplayMode(displayMode);
  }

  init(data) {
    IdeActions.init(data);
  }

  run() {
    return IdeActions.run();
  }

  handleWindowMessage(e) {
    var cmd = e.data.cmd;
    var data = e.data.data;

    switch(cmd) {
      case "ide:run":
        return this.run();
      case "ide:readme":
        return this.showReadme();
      case "ide:switch_display_mode":
        return this.switchDisplayMode(data.displayMode);
      case "ide:init":
        return this.init(data);
      default:
        return null;
    }
  }
}
