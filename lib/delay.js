"use strict";

// Returns a promise to be resolved with the value after the delay.
module.exports = function delay(ms, value) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(value);
    }, ms);
  });
};
