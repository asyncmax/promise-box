"use strict";

var test = require("tape");
var pbox = require("../");

function _defer(val) {
  return new Promise(function(resolve) {
    setImmediate(function() {
      resolve(val);
    });
  });
}

test("repeat: basic", function(t) {
  var invoked = 0, resolved = 0;

  pbox.repeat(function() {
    t.equal(invoked, resolved, "should be in series");
    invoked++;
    if (resolved === 3)
      return _defer("done");
    return _defer().then(function() {
      resolved++;
    });
  }).then(function(res) {
    t.equal(res, "done");
    t.equal(invoked, 4);
    t.equal(resolved, 3);
  }).then(t.end, t.end);

  t.equal(invoked, 0);
  t.equal(resolved, 0);
});

test("repeat: non-Promise", function(t) {
  var invoked = 0;

  pbox.repeat(function() {
    invoked++;
    if (invoked === 4)
      return "done";
  }).then(function(res) {
    t.equal(res, "done");
    t.equal(invoked, 4);
  }).then(t.end, t.end);

  t.equal(invoked, 0);
});

test("repeat: error", function(t) {
  var invoked = 0, resolved = 0;

  pbox.repeat(function() {
    t.equal(invoked, resolved, "should be in series");
    invoked++;
    if (invoked === 2)
      throw Error("TEST");
    t.equal(invoked, 1, "should get here only once");
    return _defer().then(function() {
      resolved++;
    });
  }).then(function() {
    t.fail("should not get here");
  }).catch(function(err) {
    t.equal(err.message, "TEST");
    t.equal(invoked, 2);
    t.equal(resolved, 1);
  }).then(t.end, t.end);

  t.equal(invoked, 0);
  t.equal(resolved, 0);
});

test("forEach: basic", function(t) {
  var invoked = 0, resolved = 0;
  var items = [1, 2, 3, 4];

  pbox.forEach(items, function(item, idx, arr) {
    t.equal(invoked, resolved, "should be in series");
    invoked++;
    t.equal(items, arr);
    t.equal(arr[idx], item);
    t.equal(item, idx + 1);
    return _defer().then(function() {
      resolved++;
    });
  }).then(function(res) {
    t.equal(res, true);
    t.equal(invoked, 4);
    t.equal(resolved, 4);
  }).then(t.end, t.end);

  t.equal(invoked, 0);
  t.equal(resolved, 0);
});

test("forEach: break", function(t) {
  var invoked = 0, resolved = 0;
  var items = [1, 2, 3, 4];

  pbox.forEach(items, function() {
    t.equal(invoked, resolved, "should be in series");
    invoked++;
    if (invoked === 2)
      return _defer(false);
    return _defer().then(function() {
      resolved++;
    });
  }).then(function(res) {
    t.equal(res, false);
    t.equal(invoked, 2);
    t.equal(resolved, 1);
  }).then(t.end, t.end);

  t.equal(invoked, 0);
  t.equal(resolved, 0);
});

test("forEach: break with non-Promise", function(t) {
  var invoked = 0;
  var items = [1, 2, 3, 4];

  pbox.forEach(items, function() {
    invoked++;
    if (invoked === 3)
      return false;
  }).then(function(res) {
    t.equal(res, false);
    t.equal(invoked, 3);
  }).then(t.end, t.end);

  t.equal(invoked, 0);
});

test("queue: basic", function(t) {
  var invoked = 0, resolved = 0, diff = 0;
  var queue = pbox.queue({
    data: [1, 2]
  });

  queue.put(3);
  queue.put(4);

  queue.run(function(item) {
    invoked++;
    t.equal(item, invoked);
    if (invoked - resolved > diff)
      diff = invoked - resolved;
    return _defer().then(function() {
      resolved++;
    });
  }).then(function() {
    t.equal(invoked, 4);
    t.equal(resolved, 4);
    t.equal(diff, 4);
  }).then(t.end, t.end);

  t.equal(invoked, 4);
  t.equal(resolved, 0);
});

test("queue: error", function(t) {
  var invoked = 0, resolved = 0;
  var queue = pbox.queue({
    data: [1, 2, 3, 4]
  });

  queue.run(function() {
    invoked++;
    return _defer().then(function() {
      resolved++;
      if (resolved == 2)
        return Promise.reject(Error("TEST"));
    });
  }).then(function() {
    t.fail("should not get here");
  }).catch(function(err) {
    t.equal(err.message, "TEST");
    t.equal(invoked, 4);
    t.ok(resolved >= 2);  // resolved can't be guarenteed to be 2
  }).then(t.end, t.end);

  t.equal(invoked, 4);
  t.equal(resolved, 0);
});

test("queue: concurrency option", function(t) {
  var invoked = 0, resolved = 0, diff = 0;
  var queue = pbox.queue({
    data: [1, 2, 3, 4],
    concurrency: 2
  });

  queue.run(function() {
    invoked++;
    if (invoked - resolved > diff)
      diff = invoked - resolved;
    return _defer().then(function() {
      resolved++;
    });
  }).then(function() {
    t.equal(invoked, 4);
    t.equal(resolved, 4);
    t.equal(diff, 2);
  }).then(t.end, t.end);

  t.equal(invoked, 2);
  t.equal(resolved, 0);
});

test("queue: put & end", function(t) {
  var invoked = 0, resolved = 0;
  var queue = pbox.queue();

  queue.run(function() {
    invoked++;
    return _defer().then(function() {
      resolved++;
      if (resolved === 4)
        queue.end();
    });
  }).then(function() {
    t.equal(resolved, 4);
  }).then(t.end, t.end);

  queue.put(1);
  queue.put(2);
  queue.put(3);
  queue.put(4);

  t.equal(invoked, 4);
  t.equal(resolved, 0);
});
