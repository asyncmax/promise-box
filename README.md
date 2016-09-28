# promise-box

A collection of essential Promise utilities

# Basic usage

> Fetches data from HTTP servers in series (no concurrent transactions).

```js
var fetch = require("node-fetch");
var forEach = require("promise-box/lib/forEach");

forEach([
  "http://www.google.com/",
  "http://www.yahoo.com/",
  "http://www.facebook.com/"
], url => {
  return fetch(url).then(res => {
    console.log(url, res.status, res.statusText);
  });
}).then(() => {
  console.log("done!");
});

/****** console output *******
 http://www.google.com/ 200 OK
 http://www.yahoo.com/ 200 OK
 http://www.facebook.com/ 200 OK
 done!
******************************/
```

# Why?

# How to link

> Recommended way to reduce footprint, especially on browser environment.

```js
var forEach = require("promise-box/lib/forEach");

forEach(...);
```

> If you really want a classic style.

var pbox = require("promise-box");

pbox.forEach(...);

# API

### isPromise(obj)

Returns `true` if `obj` is a promise. This function is implemented as follows:

```js
return obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
```

### repeat(callback)

Runs an asynchronous loop in series - the callback will not be called until the promise returned by the previous call is resolved.

The callback is invoked with no argument and can return one of the following:

- promise: to wait for an asynch job - a resolved value of `undefined` continues the loop and a value other than `undefined` exits the loop with the value set as a value of the promise returned by `repeat`.
- undefined: to continue the loop.
- other: to exit the loop with the value set as a value of the promise returned by `repeat`.

Returns a promise that is resolved with the callback's return value that
triggered the exit of loop.

### forEach(arr, callback)

Iterates through an array asynchronously in series - the callback will not be called until the promise returned by the previous call is resolved.

The callback is invoked with arguments `(item, idx, arr)` and can return one of the following:

- promise: to wait for an asynch job - a resolved value of `false` exits the loop early.
- false: to exit the loop early.
- other: to continue the loop.

Returns a promise that is resolved with `true` if the loop iterated all items in the array or `false` if the callback returned `false` to stop iteration.

### queue(options)

Creates a queue to coordinate execution of asynchronous tasks based using Promise.

# Develop & contribute

## Setup

```sh
git clone https://github.com/asyncmax/promise-box
cd promise-box
npm install
npm run lint  # run lint
npm test      # run test
```

## Coding style

- Use two spaces for indentation.
- Use double quotes for strings.
- Use ES5 syntax for lib & test.

# License

MIT
