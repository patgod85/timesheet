
exports.index = function(response) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {
            db.all("SELECT * FROM team;", function (err, rows) {

                if (err) {
                    response.writeHead(500, {"Content-Type": "text/html"});
                    response.write('There is a problem');
                    response.end();
                    return;
                }

//                viewModel.rows = rows;

                var body = JSON.stringify(rows);//jade.renderFile('app/views/teams.jade', viewModel);

//                response.writeHead(200, {"Content-Type": "application/json"});
                response.writeHead(200, {
//                    "access-control-allow-origin": "*",
                    "content-type": "application/json",
                    "content-length": body.length
                });
                response.write(body);
                response.end();
            });
        });
    });
};
