var fetch = require("node-fetch");
var forEach = require("promise-box/lib/forEach");

forEach([
  "http://www.google.com/",
  "http://www.yahoo.com/",
  "http://www.facebook.com/"
], url => {
  return fetch(url).then(res => {
    console.log(url, res.status, res.statusText);
  });
}).then(() => {
  console.log("done!");
});

/****** console output *******
 http://www.google.com/ 200 OK
 http://www.yahoo.com/ 200 OK
 http://www.facebook.com/ 200 OK
 done!
******************************/
