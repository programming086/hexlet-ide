const path = require("path");
const http = require("http");
const express = require("express");
const morgan = require("morgan");

const setUpStaticAssets = (app) => {
  const mincer = require("mincer");
  const Asset = require("../../tools/mincer/asset");

  app.use(Asset.viewHelper);
  console.log("STATIC PATH: " + __dirname + "/../../dist");
  app.use("/public/fonts", express.static(__dirname + "/../../dist/fonts"));
  if (process.env.NODE_ENV === "production") {
    app.use("/public/assets", express.static(__dirname + "/../../dist/assets"));
  } else {
    app.use("/public/assets/", mincer.createServer(Asset.environment));
  }
}

const setUpViews = (app) => {
  app.engine("jade", require("jade").__express);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");
}

const setUpWebsockets = (server, options) => {
  const socketIOFactory = require("socket.io");
  const rpcFactory = require("./rpc");

  const io = socketIOFactory(server);
  // TODO it might make sense to do rpc calls timeouts on the client side
  io.set("transports", ['websocket']);
  io.set("heartbeat timeout", 5000);
  io.set("heartbeat interval", 3000);
  rpcFactory(io, options);
}

const setUpDevTools = (app, options) => {
  const webpackConfig = require("../../tools/webpack/development.config");
  const compiler = require("webpack")(webpackConfig);

  require("express-debug")(app, {
    panels: ["locals", "request", "session", "template", "nav"]
  });

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

module.exports = (options) => {
  const app = express();
  const server = http.createServer(app);

  app.use(morgan("combined"));
  setUpStaticAssets(app);
  setUpViews(app);
  setUpWebsockets(server, options);

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    setUpDevTools(app, options);
  }

  // app.use(express.static(path.join(__dirname, "public")));
  app.use("/", require("./routes/index"));

  server.listen(options.port);
  return server;
};
