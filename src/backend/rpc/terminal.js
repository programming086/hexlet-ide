/* global require process module console */
var pty = require("pty.js");
var _ = require("lodash");

var terminals = {};

function connectTerminal(socket, id) {
  var terminal = terminals[id];
  terminal.on("data", function(data) {
    //FIXME: хак, пока нет дуплексной связи между сервером и клиентом
    socket.emit("terminalUpdated", { id: id, data: data });
  });
}

function createTerminal(socket, options, params) {
  var id = params.id;
  var terminal = pty.fork(process.env.SHELL || "bash", [], {
    name: require("fs").existsSync("/usr/share/terminfo/x/xterm-256color")
    ? "xterm-256color"
    : "xterm",
    cols: params.cols,
    rows: params.rows,
    cwd: options.rootDir
  });

  terminals[id] = terminal;
  connectTerminal(socket, id);

  return terminal;
}

function closeTerminal(id) {
  var terminal = terminals[id];
  terminal.destroy();
  delete terminals[id];
}

function cleanup() {
  _.each(_.keys(terminals), closeTerminal);
}

module.exports = (options) => {
  return {
    create(params) {
      var terminal = createTerminal(this.clientSocket, options, params);
      console.log("Created shell with pty master/slave pair (master: %d, pid: %d)", terminal.fd, terminal.pid);
    },

    update(msg) {
      var terminal = terminals[msg.id];
      if (terminal) {
        terminal.write(msg.data);
      }
    },

    destroy(msg) {
      var id = msg.id;
      var terminal = terminals[id];

      if (terminal) {
        closeTerminal(id);
        console.log("Destroy shell pty with (master: %d, pid: %d)", terminal.fd, terminal.pid);
      }
    },

    reconnect(params) {
      var id = params.id;
      if (terminals[id]) {
        connectTerminal(this.clientSocket, id);
      }
    },

    createDefault(params) {
      cleanup();

      var terminal = createTerminal(this.clientSocket, options, params);
      console.log("Created default shell with pty master/slave pair (master: %d, pid: %d)", terminal.fd, terminal.pid);
    },

    resize(msg) {
      var terminal = terminals[msg.id];

      if (terminal) {
        terminal.resize(msg.cols, msg.rows);
      }
    }
  };
};
