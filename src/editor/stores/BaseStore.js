/* global require module */

import _ from "lodash";
var EventEmitter = require("events").EventEmitter;

var CHANGE_EVENT = "change";

function BaseStore() { "use strict";
  EventEmitter.call(this);
}

BaseStore.prototype = new EventEmitter();

BaseStore.prototype.emitChange = function() {
  setTimeout(() => { this.emit(CHANGE_EVENT); }, 0);
};

BaseStore.prototype.addChangeListener = function(callback) {
  this.on(CHANGE_EVENT, callback);
};

BaseStore.prototype.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback);
};

BaseStore.extend = function(data) {
  return _.extend(new BaseStore(), data);
};

module.exports = BaseStore;
