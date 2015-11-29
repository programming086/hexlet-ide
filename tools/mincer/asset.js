var Mincer = require("mincer");
var path = require("path");

var DIST_ASSET_PATH = "../../dist/assets/";
var PUBLIC_ASSET_PATH = "public/assets/";

Mincer.logger.use(console);

var environment = new Mincer.Environment(__dirname);
var manifest = new Mincer.Manifest(environment, path.join(__dirname, DIST_ASSET_PATH));

environment.enable("autoprefixer");
environment.enable("source_maps");
environment.appendPath("../../node_modules");
environment.appendPath("../../bower_components");
environment.appendPath("../../src/editor/assets/stylesheets");
environment.appendPath("../../src/editor/assets/javascript");

if (process.env.NODE_ENV === "production") {
  environment.jsCompressor = "uglify";
  environment.cssCompressor = "csswring";
  environment = environment.index;
}

Mincer.MacroProcessor.configure([ ".js", ".css", ".less", ".woff2", ".woff", ".ttf" ]);

// environment.ContextClass.defineAssetPath(function(logicalPath) {
//   var asset = this.environment.findAsset(logicalPath);

//   if (!asset) {
//     throw new Error("Asset " + logicalPath + " not found");
//   }

//   return asset.digestPath;
// });

module.exports.environment = environment;
module.exports.manifest = manifest;

module.exports.viewHelper = function(req, res, next) {
  if (res.locals) {
    res.locals.assetPath = function assetPath(logicalPath) {
      if (process.env.NODE_ENV === "production") {
        return PUBLIC_ASSET_PATH + manifest.assets[logicalPath];
      } else {
        var asset = environment.findAsset(logicalPath);

        if (!asset) {
          throw new Error("Asset " + logicalPath + " not found");
        }

        return PUBLIC_ASSET_PATH + asset.digestPath;
      }
    }
  }

  next();
};

module.exports.manifestCompiler = function() {
  try {
    manifest.compile([ "application.css", "application.js", "bootstrap-sass/assets/fonts/bootstrap/*" ],
    { compress: true, sourceMaps: true, embedMappingComments: true });

    console.info("\n\nAssets were successfully compiled.\nManifest data (a proper JSON) was written to:\n" +
    manifest.path + "\n\n");
  } catch (err) {
    console.error("Failed compile assets: " + (err.message || err.toString()));
  }
};
