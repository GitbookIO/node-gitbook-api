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

Or using an oauth token:

```js
var client = new GitBook({
    token: "oauth token"
});
```

To use this api client with a GitBook Enterprise instance, simply add a `host` option, example: `"host": "http://gitbook.mycompany.com"`.

#### List books

List books fron the authenticated user:

```js
client.books()
.then(function(page) {
    // page.list: list of books
    // page.total: total count of books

    // Fetch next page
    return page.next();
}, function(err) {
    // Error occured
});
```

List all public books:


```js
client.books('all')
```

#### Get a specific book

```js
var book = client.book("GitBookIO/javascript");
book.details().then(function(infos) { ... });
```

#### Get details about an author

```js
var author = client.author("GitBookIO");
author.then(function(infos) { ... });
```
