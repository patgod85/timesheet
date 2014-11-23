var jade = require('jade');

exports.index = function(response, request) {
    var body = jade.renderFile('app/views/index.jade', {user: request.user});
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};

