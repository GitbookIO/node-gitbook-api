var debug = require("./debug");
var client = require("./client");
var path = require("path");

debug(
    client.book("SamyPesse/markdown")
    .then(function(book) {
        return book.publishFolder("0.0.1", path.join(__dirname, "../"));
    })
);
