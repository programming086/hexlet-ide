/* global require process module console */
const pty = require("pty.js");
const _ = require("lodash");

const terminals = {};

function connectTerminal(socket, id) {
  const terminal = terminals[id];
  terminal.on("data", (data) => {
    //FIXME: хак, пока нет дуплексной связи между сервером и клиентом
    socket.emit("terminalUpdated", { id: id, data: data });
  });
}

function createTerminal(socket, options, params) {
  const id = params.id;
  const terminal = pty.fork(process.env.SHELL || "bash", [], {
    name: require("fs").existsSync("/usr/share/terminfo/x/xterm-256color")
    ? "xterm-256color"
    : "xterm",
    cols: params.cols,
    rows: params.rows,
    cwd: options.appDir
  });

  terminals[id] = terminal;
  connectTerminal(socket, id);

  return terminal;
}

function closeTerminal(id) {
  const terminal = terminals[id];
  terminal.destroy();
  delete terminals[id];
}

function cleanup() {
  _.each(_.keys(terminals), closeTerminal);
}

module.exports = (options) => {
  return {
    create(params) {
      const terminal = createTerminal(this.clientSocket, options, params);
      console.log("Created shell with pty master/slave pair (master: %d, pid: %d)", terminal.fd, terminal.pid);
    },

    update(msg) {
      const terminal = terminals[msg.id];
      if (terminal) {
        terminal.write(msg.data);
      }
    },

    destroy(msg) {
      const id = msg.id;
      const terminal = terminals[id];

      if (terminal) {
        closeTerminal(id);
        console.log("Destroy shell pty with (master: %d, pid: %d)", terminal.fd, terminal.pid);
      }
    },

    reconnect(params) {
      const id = params.id;
      if (terminals[id]) {
        connectTerminal(this.clientSocket, id);
      }
    },

    createDefault(params) {
      cleanup();

      const terminal = createTerminal(this.clientSocket, options, params);
      console.log("Created default shell with pty master/slave pair (master: %d, pid: %d)", terminal.fd, terminal.pid);
    },

    resize(msg) {
      const terminal = terminals[msg.id];

      if (terminal) {
        terminal.resize(msg.cols, msg.rows);
      }
    }
  };
};
