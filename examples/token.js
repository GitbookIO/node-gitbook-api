var GitBook = require("../lib");
var debug = require("./debug");

var client = new GitBook({
    host: "http://localhost:5000",
    auth: {
        username: "GitBookIO",
        password: "testtest"
    }
});

debug(client.account());
