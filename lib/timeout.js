"use strict";

// Wraps a promise to limit an operation with a timeout
module.exports = function timeout(p, ms) {
  return new Promise(function(resolve, reject) {
    function _clear() {
      if (id) {
        clearTimeout(id);
        id = null;
        return true;
      } else {
        return false;   // already timed out
      }
    }

    var id = setTimeout(function() {
      var err = Error("Operation timed out");
      err.code = "TIMEOUT_ERROR";
      reject(err);
      id = null;
    }, ms);

    p.then(function(val) {
      if (_clear())
        resolve(val);
    }, function(err) {
      if (_clear())
        reject(err);
    });
  });
};
