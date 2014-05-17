// Requires
var path = require('path');

var tar = require("tar");
var zlib = require("zlib");
var fstream = require("fstream");


function streamTarGzDir(dirPath, includeBaseDir) {
    includeBaseDir = includeBaseDir || false;

    // Absolute path of the directory
    var fullPath = path.resolve(dirPath);

    return fstream.Reader({
        path: fullPath,
        type: "Directory",
        filter: function () {
            // Exclude the base directory itself in the tar
            if(!includeBaseDir && this.dirname == fullPath) {
                this.root = null;
            }
            return !(this.basename.match(/^\.git/) || this.basename.match(/^node_modules/));
        }
    })
    .pipe(tar.Pack())
    .pipe(zlib.createGzip());
}


// Exports
module.exports = streamTarGzDir;
