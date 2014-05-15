GitBook API Client
==========

This is a node client library for the GitBook (https://www.gitbook.io) API.

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

        // password or token
        password: "mypassword"
    }
});
```

#### List user books

```js
client.books()
.then(function(books) {
    // 'books' is a list of Book objects
    console.log(books);
});
```

#### Get a specific book

```js
client.book("GitBookIO/javascript")
.then(function(book) {
    // 'book' is a Book object
});
```

#### Publish a book

```js
book.publishFolder("0.0.1", "./book")
```
