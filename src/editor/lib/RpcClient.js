/* global module require  */

var io = require("socket.io-client");
var _ = require("lodash");

var rpc = require("../../lib/rpc");

var RpcClient = {
  init(params) {
    var socket = io.connect(params.url, params.options);
    _.each(params.events, function(callback, name) {
      "use strict";
      socket.on(name, callback);
    });

    this.socket = socket;
    this.client = rpc.createClient(socket);
  },

  getClient() {
    return this.client;
  }
};

export default RpcClient;






