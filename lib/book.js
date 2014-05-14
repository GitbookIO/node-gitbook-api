var util = require('util');
var _ = require('lodash');
var Q = require('q');

var fs = require('fs');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');

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
    var d = Q.defer();

    if (_.isString(tar)) tar = fs.createReadStream(tar);

    tar.pipe(this.client.http.put(this.client.config.host+"/api/"+this.id+"/builds"));

    return d.promise;
};

// Publish a new version
// tar can be a stream or a string
Book.prototype.publishFolder = function(version, folder) {
    var s = fstream.Reader({ 'path' : folder, 'type' : 'Directory' })
            .pipe(tar.Pack())
            .pipe(zlib.Gzip());

    return this.publish(version, s);
};

module.exports = Book;
