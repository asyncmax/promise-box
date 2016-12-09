# promise-box

A collection of essential Promise utilities

# Basic usage

> Fetches data from HTTP servers limiting maximum concurrency level to 2.

```js
var fetch = require("node-fetch");
var queue = require("promise-box/lib/queue");

var tasks = queue({
  data: [
    "http://www.google.com/",
    "http://www.yahoo.com/",
    "http://www.facebook.com/",
    "http://www.github.com/"
  ],
  concurrency: 2
});

tasks.run(url => {
  console.log("Fetching:", url);
  return fetch(url).then(res => {
    console.log("Done:", url, res.status, res.statusText);
  });
}).then(() => {
  console.log("All finished!");
});

/****** console output *******
 Fetching: http://www.google.com/
 Fetching: http://www.yahoo.com/
 Done: http://www.google.com/ 200 OK
 Fetching: http://www.facebook.com/
 Done: http://www.yahoo.com/ 200 OK
 Fetching: http://www.github.com/
 Done: http://www.github.com/ 200 OK
 Done: http://www.facebook.com/ 200 OK
 All finished!
******************************/
```

# Why?

You will encounter many repetitive coding patterns when using Promises. Writing your own solution for every and each case is time consuming and error-prone.

# How to link

> Recommended way to reduce footprint, especially for browser environment.

```js
var forEach = require("promise-box/lib/forEach");

forEach(...);
```

> If you really want the classic style. Note that, by using this pattern, you will include the entire code base regardless of actual functions you use.

```js
var pbox = require("promise-box");

pbox.forEach(...);
```

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

Creates a queue to coordinate execution of asynchronous tasks.

#### Options

- concurrency: Maximum concurrency level. Default is 32.
- data: Array of items for the handler. You can also add items using `put` method after the queue is created. If this is specified, `autoEnd` is set to true. Default is null.
- autoEnd: If true, the promise returned by `run` method will be resolved automatically if the queue becomes empty. If false, the promise will be resolved only when both you call `end` method and the queue becomes empty.

#### Returned Object

- run(handler): Starts processing of enqueued items. Returns a promise to be resolved when all items are processed. The handler is called with an item as only argument. If the handler returns a promise, the task is considered done when the promise is resolved.

- put(item): Adds an item to the queue.

- end(): Indicates the end of queue. After you call this method, the promise returned by `run` method will be resolved automatically as soon as the queue becomes empty.

### promisify(func, thisObj)

Promisifies a callback based function. `const readFileP = promisify(fs.readFile, fs)`.

### wrap(func)

Wraps a function with a try-catch block and returns a promise to be resolved with the return value of the function. If the function throws an exception, the returned promise will be rejected with the exception object.

### timeout(promise, ms)

Returns a promise wrapping another promise to limit the duration of operation with a timeout. If the inner promise is resolved within the timeout, the returned promise will be also resolved with the same value. If a timeout occurs before the inner promise is resolved, the returned promise will be rejected with an timeout exception. The inner promise's status change will be ignored after the timeout.

### delay(ms, value)

Returns a promise to be resolved with the value after the specified delay.

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
