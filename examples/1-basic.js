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
