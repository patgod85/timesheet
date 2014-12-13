var http = require("http");
var url = require("url");
//var auth = require("http-auth");

//var basic = auth.basic(
//    {
//        realm: "Welcome to",
//        msg401: "Bad"
//    },
//    function (username, password, callback) {
//        callback(username === "victor" && password === "victor1");
//    }
//);

function start(route, handle) {
    function onRequest(request, response) {

        // When dealing with CORS (Cross-Origin Resource Sharing)
// requests, the client should pass-through its origin (the
// requesting domain). We should either echo that or use *
// if the origin was not passed.
        var origin = (request.headers.origin || "*");


// Check to see if this is a security check by the browser to
// test the availability of the API for the client. If the
// method is OPTIONS, the browser is check to see to see what
// HTTP methods (and properties) have been granted to the
// client.
        if (request.method.toUpperCase() === "OPTIONS"){


// Echo back the Origin (calling domain) so that the
// client is granted access to make subsequent requests
// to the API.
            response.writeHead(
                "204",
                "No Content",
                {
                    "access-control-allow-origin": origin,
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "access-control-allow-headers": "content-type, accept",
                    "access-control-max-age": 10, // Seconds.
                    "content-length": 0
                }
            );

// End the response - we're not sending back any content.
            return( response.end() );


        }








        var postData = "";
        var pathname = url.parse(request.url).pathname;

        request.setEncoding("utf8");

        request.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });

        request.addListener("end", function () {

            response.setHeader("access-control-allow-origin", "http://localhost:8000");

            route(handle, pathname, request, response, postData);
        });

    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;