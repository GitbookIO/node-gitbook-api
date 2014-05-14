var GitBook = require("../lib");
var debug = require("./debug");

var client = new GitBook({
    host: "http://localhost:5000",
    auth: {
        username: "SamyPesse",
        password: "2f2274b1-6eb8-4b38-99ce-b4c9119d06ea"
    }
});

module.exports = client;
