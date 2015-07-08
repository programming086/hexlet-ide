/* global module require window */

var _ = require("lodash");

var defaultConfig = {
  terminal: {
    cols: 110,
    rows: 8
  },
  autosaveInterval: 3000,
  rpc: {
    url: "",
    options: {
      path: "socket.io",
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000
    },
    events: {
      connect: _.noop,
      error: _.noop,
      disconnect: _.noop,
      reconnect: _.noop,
      reconnecting: _.noop,
      reconnect_error: _.noop,
      reconnect_failed: _.noop
    }
  },
};


module.exports = {
  extend: function(config) {
     _.extend(this, _.merge(defaultConfig, config));
  }
};
