node-gitbook-api
==========

This is a javascript/node client library for the GitBook (https://www.gitbook.com) API.

This API is promise-based.

## Installation

```
$ npm install gitbook-api
```

## Examples

#### Create a client

```js
var GitBook = require("gitbook-api");
var client = new GitBook();
```

#### Authentication

```js
var client = new GitBook({
    auth: {
        username: "Me",

        // Password or API token
        password: "mypassword"
    }
});
```

#### List user books

```js
client.books().then(function(books) { });
```

#### Get a specific book

```js
client.book("GitBookIO/javascript").then(function(book) { });
```
