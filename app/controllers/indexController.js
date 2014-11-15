var jade = require('jade');

exports.index = function(response) {
    var body = jade.renderFile('app/views/index.jade');
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};

