# `gitbook-api`

[![Build Status](https://travis-ci.org/GitbookIO/node-gitbook-api.svg?branch=master)](https://travis-ci.org/GitbookIO/node-gitbook-api)
[![NPM version](https://badge.fury.io/js/gitbook-api.svg)](http://badge.fury.io/js/gitbook-api)

Node and browser, javascript client for the [GitBook.com API](https://developer.gitbook.com/).

## Installation

```
$ npm install gitbook-api --save
```

## Usages


```js
const GitBookAPI = require('gitbook-api');
const client = new GitBookAPI();
```

Or create an API client with an authentified user:

```js
const client = new GitBookAPI({
    username: 'MyUsername',
    token: 'password or token'
});
```

Or using an OAuth token:

```js
var client = new GitBookAPI({
    token: 'oauth token'
});
```

Then execute API requests:

```js
client.get('book/you/yourbook')
.then((json) => {})
.catch(err => {})

client.post('book/you/yourbook/discussions/1/comments', { ... })
```
