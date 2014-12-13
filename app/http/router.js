function route(handle, pathname, request, response, postData) {

    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request, {user: request.user}, postData);
    } else {

        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;