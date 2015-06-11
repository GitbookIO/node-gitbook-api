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

Create an API client with an authentified user:

```js
var client = new GitBook({
    username: "MyUsername",
    token: "password or token"
});
```

To use this api client with a GitBook Enterprise instance, simply add a `host` option, example: `"host": "http://gitbook.mycompany.com"`.

#### List books

List books fron the authenticated user:

```js
client.books()
.then(function(result) {
    // result.list: list of books
    // result.total: total count of books
}, function(err) {
    // Error occured
});
```

List all public books:


```js
client.books('all')
```

Use pagination:

```js
client.books({ skip: 50, limit: 100 })
client.books('all', { skip: 50, limit: 100 })
```

#### Get a specific book

```js
client.book("GitBookIO/javascript").then(function(book) { });
```
