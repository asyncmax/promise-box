"use strict";

var isPromise = require("./isPromise");

module.exports = function queue(options) {
  function _digest() {
    if (_handler) {
      var max = options.concurrency || 32;

      while (_waiting.length && _pending.length < max) {
        var data = _waiting.shift();
        var res;
        try {
          res = _handler(data);
        } catch (err) {
          return _error(err);
        }
        if (isPromise(res)) {
          res.then(_complete.bind(null, res), _error);
          _pending.push(res);
        }
      }

      if (_isEnding && !_pending.length && !_waiting.length) {
        _handler = null;
        _resolve();
      }
    }
  }

  function _complete(pr) {
    if (_handler) {
      var idx = _pending.indexOf(pr);
      if (idx !== -1)
        _pending.splice(idx, 1);
      _digest();
    }
  }

  function _error(err) {
    if (_handler) {
      _handler = null;
      _reject(err);
    }
  }

  var _waiting = [], _pending = [];
  var _handler, _isEnding, _resolve, _reject;

  options = options || {};

  if (options.data) {
    _waiting = _waiting.concat(options.data);
    _isEnding = options.autoEnd === undefined ? true : options.autoEnd;
  } else {
    _isEnding = options.autoEnd;
  }

  return {
    run: function(handler) {
      _handler = handler;
      return new Promise(function(resolve, reject) {
        _resolve = resolve;
        _reject = reject;
        _digest();
      });
    },

    put: function(data) {
      _waiting.push(data);
      _digest();
    },

    end: function() {
      _isEnding = true;
    },

    count: function() {
      return _waiting.length + _pending.length;
    }
  };
};
