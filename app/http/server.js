var http = require("http");
var url = require("url");
var auth = require("http-auth");

var basic= auth.basic(
    {
        realm: "Добрый добрый",
        msg401: "Bad"
    },
    function(username, password, callback){
        callback(username === "victor" && password === "victor1");
    }
);

function start(route, handle) {
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener("end", function() {
      route(handle, pathname, request, response, postData);
    });

  }

  http.createServer(basic, onRequest).listen(8888);
}

exports.start = start;