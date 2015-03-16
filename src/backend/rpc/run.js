/* global require process module console */
var _ = require("lodash");
var cp = require("child_process");
var when = require("when");

module.exports = function(options) {
  return {

    exec: function(command) {
      var deferred = when.defer();

      if (this.child) {
        this.child.kill("SIGTERM");
      }

      var socket = this.clientSocket;
      var arr = command.split(" ");

      this.child = cp.spawn(arr[0], _.tail(arr));

      this.child.on("exit", function(code, signal) {
        var data = {
          code: code,
          signal: signal
        };
        socket.emit("run.finish", data);

        deferred.resolve(data);
      });

      this.child.stderr.on("data", function(chunk) {
        socket.emit("run.progress", chunk.toString());
      });

      this.child.stdout.on("data", function(chunk) {
        socket.emit("run.progress", chunk.toString());
      });

      return deferred.promise;
    }
  };
};
