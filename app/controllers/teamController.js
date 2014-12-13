var jade = require('jade');
var url = require('url');

exports.index = function(response, request, viewModel) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        var query = url.parse(request.url, true).query;

        db.serialize(function () {
            db.all("SELECT * FROM employee WHERE team_id = ?", query.id, function (employeesErr, employees) {

                if (employeesErr) {
                    response.writeHead(500, {"Content-Type": "text/html"});
                    response.write('There is a problem');
                    response.end();
                    return;
                }

                db.get("SELECT * FROM team WHERE id = ?", query.id, function (teamErr, team) {

                    if (teamErr) {
                        response.writeHead(500, {"Content-Type": "text/html"});
                        response.write('There is a problem');
                        response.end();
                        return;
                    }

                    viewModel.employees = employees;
                    viewModel.team = team;
                    viewModel.id = query.id;

                    var body = jade.renderFile('app/views/team.jade', viewModel);

                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(body);
                    response.end();
                });
            });
        });
    });
};
