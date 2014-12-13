var jade = require('jade');

exports.index = function(response, request, viewModel) {
    var body = jade.renderFile('app/views/index.jade', viewModel);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};

