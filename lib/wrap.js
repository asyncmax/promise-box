"use strict";

module.exports = function wrap(func) {
  return new Promise(function(resolve, reject) {
    try {
      resolve(func());
    } catch (err) {
      reject(err);
    }
  });
};
