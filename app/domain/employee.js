module.exports.getAll = function(done) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {
            db.all("SELECT * FROM employee e", function (err, employees) {

                if (err) {
                    done(null, 'Error');
                }

                var query = "SELECT e.*, ed.*, d.* " +
                    "FROM employee e " +
                    "JOIN employee_day ed ON e.id = ed.employee_id " +
                    "JOIN day d ON d.id = ed.day_id ";

                db.all(query, function (err, days) {

                    if (err) {
                        done(null, 'Error');
                    }

                    var teams = {};

                    for (var i = 0; i < employees.length; i++) {
                        if(!teams.hasOwnProperty(employees[i].team_id)){
                            teams[employees[i].team_id] = {employees: {}};
                        }
                        teams[employees[i].team_id].employees[employees[i].id] = employees[i];
                        teams[employees[i].team_id].employees[employees[i].id].days = {};
                    }

                    for (i = 0; i < days.length; i++) {
                        //if(teams[employees[i].team_id].employees.hasOwnProperty(days[i].employee_id)) {
                            teams[days[i].team_id].employees[days[i].employee_id].days[days[i].date] = (days[i]);
                        //}
                    }

                    done(teams);
                });
            });

        })
    });
};