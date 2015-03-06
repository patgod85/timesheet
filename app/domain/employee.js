module.exports.getAll = function(user, done) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {

            var userCondition = '',
                userConditionParams = [];

            if(!user.is_super){
                userCondition = ' WHERE t.id = ? ';
                userConditionParams = [user.team_id];
            }

            var query = "SELECT e.*, t.code AS team_code "
                    + "FROM employee e "
                    + "JOIN team t ON e.team_id = t.id "
                    + userCondition;

            db.all(query, userConditionParams, function (err, employees) {

                if (err) {
                    done(null, 'Error');
                }

                var query = "SELECT e.*, ed.*, d.*, t.code AS team_code "
                    + "FROM employee e "
                    + "JOIN employee_day ed ON e.id = ed.employee_id "
                    + "JOIN day d ON d.id = ed.day_id "
                    + "JOIN team t ON e.team_id = t.id "
                    + userCondition;

                db.all(query, userConditionParams, function (err, days) {

                    if (err) {
                        done(null, 'Error');
                    }

                    var teams = {};

                    for (var i = 0; i < employees.length; i++) {
                        if(!teams.hasOwnProperty(employees[i].team_code)){
                            teams[employees[i].team_code] = {employees: {}};
                        }
                        teams[employees[i].team_code].employees[employees[i].id] = employees[i];
                        teams[employees[i].team_code].employees[employees[i].id].days = {};
                    }

                    for (i = 0; i < days.length; i++) {
                        //if(teams[employees[i].team_id].employees.hasOwnProperty(days[i].employee_id)) {
                            teams[days[i].team_code].employees[days[i].employee_id].days[days[i].date] = (days[i]);
                        //}
                    }

                    done(teams);
                });
            });

        })
    });
};