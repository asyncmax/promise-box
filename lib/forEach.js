"use strict";

var isPromise = require("./isPromise");
var repeat = require("./repeat");

// Iterates through an array asynchronously in series - the callback will not
// be called until the promise returned by the previous call is resolved.
//
// The callback is invoked with arguments `(item, idx, arr)` and can return
// one of the following:
//  - promise: to wait for an asynch job - a resolved value of `false` exits
//    the loop early.
//  - false: exits the loop early.
//  - other: continues the loop.
//
// Returns a promise that is resolved with `true` if the loop iterated all
// items in the array or `false` if the callback returned `false` to stop
// iteration.
module.exports = function forEach(arr, callback) {
  var idx = 0;
  return repeat(function() {
    if (idx >= arr.length)
      return true;
    var res = callback(arr[idx], idx, arr);
    idx++;
    if (isPromise(res)) {
      return res.then(function(res) {
        if (res === false)
          return false;
      });
    } else {
      if (res === false)
        return false;
    }
  });
};
