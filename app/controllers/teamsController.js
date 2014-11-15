var jade = require('jade');

exports.teams = function(response) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {
            db.all("SELECT name FROM team;", function (err, rows) {

                console.log(err);

                if (err) {
                    response.writeHead(500, {"Content-Type": "text/html"});
                    response.write('There is a problem');
                    response.end();
                    return;
                }

                var body = jade.renderFile('app/views/teams.jade', {rows: rows});

                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(body);
                response.end();
            });
        });
    });
};
