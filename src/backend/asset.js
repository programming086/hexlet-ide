var Mincer = require("mincer");
var path = require("path");

var ASSET_PATH = "public/assets/";

Mincer.logger.use(console);

var environment = new Mincer.Environment(__dirname);

environment.enable("autoprefixer");
environment.enable("source_maps");

environment.appendPath("../editor/assets/stylesheets");
environment.appendPath("../editor/assets/javascript");
environment.appendPath("../../node_modules");
environment.appendPath("../../bower_components");

if (process.env.NODE_ENV === "production") {
  environment.jsCompressor = "uglify";
  environment.cssCompressor = "csswring";
  environment = environment.index;
}

Mincer.MacroProcessor.configure([ ".js", ".css", ".less" ]);

var assetPath = function() {
  return function (logicalPath) {
    var asset = environment.findAsset(logicalPath);

    if (!asset) {
      throw new Error("Asset " + logicalPath + " not found");
    }

    return ASSET_PATH + asset.digestPath;
  }
}();

module.exports.environment = environment;

module.exports.viewHelper = function(req, res, next) {
  if (res.locals) {
    res.locals.assetPath = assetPath;
  }

  next();
};

module.exports.manifestCompiler = function() {
  var manifest = new Mincer.Manifest(environment, path.join(__dirname, ASSET_PATH));

  try {
    manifest.compile([ "application.css", "application.js" ],
                     { compress: true, sourceMaps: true, embedMappingComments: true });

                     console.info("\n\nAssets were successfully compiled.\nManifest data (a proper JSON) was written to:\n" +
                                  manifest.path + "\n\n");
  } catch (err) {
    console.error("Failed compile assets: " + (err.message || err.toString()));
  }
};
