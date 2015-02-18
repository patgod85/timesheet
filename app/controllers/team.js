var url = require('url');

module.exports = function(viewModel) {
    return function(request, response) {

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

            var query = url.parse(request.url, true).query;

            db.serialize(function () {

                db.get("SELECT * FROM team WHERE code = ?", query.code, function (teamErr, team) {
                    if (teamErr) {
                        response.writeHead(500, {"Content-Type": "text/html"});
                        response.write('There is a problem');
                        response.end();
                        return;
                    }

                    db.all("SELECT * FROM employee e WHERE e.team_id = ?", team.id, function (employeesErr, employees) {

                        var query = "SELECT ed.*, d.* " +
                            "FROM employee e " +
                            "JOIN employee_day ed ON e.id = ed.employee_id " +
                            "JOIN day d ON d.id = ed.day_id " +
                            "WHERE e.team_id = ? ";

                        db.all(query, team.id, function (daysErr, days) {

                            if (employeesErr) {
                                response.writeHead(500, {"Content-Type": "text/html"});
                                response.write('There is a problem' + JSON.stringify(employeesErr));
                                response.end();
                                return;
                            }

                            viewModel.employees = {};

                            for (var i = 0; i < employees.length; i++) {
                                viewModel.employees[employees[i].id] = employees[i];
                                viewModel.employees[employees[i].id].days = {};
                            }

                            for (i = 0; i < days.length; i++) {
                                viewModel.employees[days[i].employee_id].days[days[i].date] = (days[i]);
                            }

                            viewModel.team = team;
                            viewModel.id = team.id;


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
            });
        });
    }
};
