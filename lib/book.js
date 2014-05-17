var util = require('util');
var _ = require('lodash');
var Q = require('q');

var tmp = require('tmp');
var path = require('path');
var fs = require('fs');
var streamTarGzDir = require('./stream-tar-gz-dir');

var Model = require('./model');

var Book = function() {
    Model.apply(this, arguments);

    _.defaults(this, {
        'id': null,
        'title': null,
        'name': null,
        'description': null
    });
};
util.inherits(Book, Model);

// Publish a new version
// tar can be a stream or a string
Book.prototype.publish = function(version, tar) {
    var deferred = Q.defer();

    if (_.isString(tar)) tar = fs.createReadStream(tar);

    tar.on("data", function(chunk) {
        deferred.notify(chunk.length);
    })

    var r = this.client.http.put(this.client.config.host+"/api/book/"+this.id+"/builds", {
        qs: {
            "version": version
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            deferred.reject(error || body);
        }
    });

    var form = r.form()
    form.append('book', tar, {
        filename: 'book.tar.gz',
        contentType: 'application/x-compressed'
    });

    return deferred.promise;
};

// Publish a new version
// tar can be a stream or a string
Book.prototype.publishFolder = function(version, folder) {
    var that = this;

    return Q.nfcall(tmp.file)
    .spread(function(tmpFilename, fd) {
        var d = Q.defer();

        var out = fs.createWriteStream(tmpFilename);
        var s = streamTarGzDir(folder);

        s.on("end", function() {
            d.resolve(tmpFilename);
        });

        s.pipe(out);

        return d.promise;
    })
    .then(function(fp) {
        return that.publish(version, fp);
    });
};

module.exports = Book;
