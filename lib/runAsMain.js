"use strict";

module.exports = function runAsMain(promise) {
  return promise.catch(function(err) {
    console.error(err);
    process.on("exit", function() {
      process.exit(1);
    });
  });
};
