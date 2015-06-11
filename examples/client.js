var GitBook = require("../lib");
var debug = require("./debug");

var client = new GitBook({
    host: process.env.GITBOOKAPI_HOST,
    username: process.env.GITBOOKAPI_USERNAME,
    token: process.env.GITBOOKAPI_TOKEN
});

module.exports = client;
