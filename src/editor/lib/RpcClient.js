/* global module require  */

import io from "socket.io-client";
import _ from "lodash";
import rpc from "../../lib/rpc";

export default {
  init(params) {
    const socket = io.connect(params.url, params.options);

    _.each(params.events, (callback, name) =>  socket.on(name, callback));

    this.socket = socket;
    this.client = rpc.createClient(socket);
  },

  getClient() {
    return this.client;
  },

  forceReconnect() {
    //NOTE: it's works. Socket io can't force reconnect, and i did it on my own.
    const socket = this.socket;
    socket.io.reconnecting = false;
    socket.io.skipReconnect = false;
    socket.io.readyState = "closed";
    const oldDuration = socket.io.backoff.max;
    socket.io.backoff.max = 50;
    socket.io.reconnect();
    socket.io.backoff.max = oldDuration;
  }

};
