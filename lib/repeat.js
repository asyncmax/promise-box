"use strict";

var isPromise = require("./isPromise");

// Runs an asynchronous loop in series - the callback will not be called
// until the promise returned by the previous call is resolved.
//
// The callback is invoked with no argument and can return one of the following:
//  - promise: to wait for an asynch job - a resolved value of `undefined`
//    continues the loop and a value other than `undefined` exits the loop
//    with the value set as a value of the promise returned by `repeat`.
//  - undefined: continues the loop.
//  - other: exits the loop with the value set as a value of the promise
//    returned by `repeat`.
//
// Returns a promise that is resolved with the callback's return value that
// triggered the exit of loop.
module.exports = function repeat(callback) {
  return new Promise(function(resolve, reject) {
    function _proceed() {
      var res;
      try {
        res = callback();
      } catch (err) {
        return reject(err);
      }
      if (isPromise(res)) {
        res.then(function(value) {
          if (value === undefined)
            _next();
          else
            resolve(value);
        }, reject);
      } else {
        if (res === undefined)
          _next();
        else
          resolve(res);
      }
    }

    function _next() {
      setImmediate(_proceed);
    }

    _next();
  });
};
