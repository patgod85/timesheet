var url = require('url');

module.exports = function(viewModel){
    return function(request, response) {

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

            db.serialize(function () {

                db.all("SELECT * FROM day_type", function (typesErr, types) {

                    if (typesErr) {
                        response.writeHead(500, {"Content-Type": "text/html"});
                        response.write('There is a problem' + JSON.stringify(typesErr));
                        response.end();
                        return;
                    }

                    for(var i = 0; i < types.length; i++){
                        viewModel[types[i].id] = types[i];
                    }

                    var body = JSON.stringify(viewModel);
//console.log(body);
                    response.writeHead(200, {
                        "content-type": "application/json",
                        "content-length": body.length
                    });

                    response.write(body);
                    response.end();
                });
            });
        });
    }
};
