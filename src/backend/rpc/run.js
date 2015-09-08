/* global require process module console */
var _ = require("lodash");
var cp = require("child_process");
var when = require("when");

module.exports = function(options) {
  var childs = {};

  return {
    exec: function(command) {
      var socket = this.clientSocket;
      var arr = command.split(" ");
      var deferred = when.defer();

      var currentChild = _.find(childs, { current: true });

      if (currentChild) {
        currentChild.state = "killed_manually";
        currentChild.current = false;

        process.kill(-currentChild.process.pid);

        // currentChild.process.stdin.pause();
        // currentChild.process.stdout.pause();
        // currentChild.process.kill();
        console.log("Kill child with pid: " + currentChild.process.pid);
      }

      console.log("Run command: ", arr.join(" "), { cwd: options.rootDir });
      var proc = cp.spawn(arr[0], _.tail(arr), { cwd: options.rootDir, detached: true });

      var child = {
        state: "started",
        process: proc,
        current: true
      };

      proc.on("exit", function(code, signal) {
        if (child.state !== "killed_manually") {
          var data = {
            code: code,
            signal: signal
          };
          socket.emit("run.finish", data);

          deferred.resolve(data);

          child.state = "finished";
          child.current = false;
        }
      });

      proc.stderr.on("data", function(chunk) {
        if (child.state !== "killed_manually") {
          console.log("Run stderr data: ", chunk);
          socket.emit("run.progress", chunk.toString());
        }
      });

      proc.stdout.on("data", function(chunk) {
        if (child.state !== "killed_manually") {
          console.log("Run stdout data: ", chunk);
          socket.emit("run.progress", chunk.toString());
        }
      });

      childs[proc.pid] =  child;

      return deferred.promise;
    }
  };
};
