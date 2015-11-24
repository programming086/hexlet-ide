/* global module require */
const rpc = require("../lib/rpc");

module.exports = (io, options) => {
  rpc.createServer(io, {
    fs: require("./rpc/fs")(options),
    terminal: require("./rpc/terminal")(options),
    run: require("./rpc/run")(options)
  });
};
