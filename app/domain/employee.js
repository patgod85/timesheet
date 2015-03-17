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

            db.all(query, userConditionParams, function (err, _employees) {

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

                    var employees = {};

                    for (var i = 0; i < _employees.length; i++) {
                        employees[_employees[i].id] = _employees[i];
                        employees[_employees[i].id].days = {};
                        employees[_employees[i].id].path = '/' + employees[_employees[i].id].team_code + '/';
                    }

                    for (i = 0; i < days.length; i++) {
                        employees[days[i].employee_id].days[days[i].date] = (days[i]);
                    }

                    done(
                        Object.keys(employees)
                            .map(function (key) {
                                return employees[key]
                            })
                    );
                });

            });
        })
    });
};

module.exports.update = function(employee, done){

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        if(employee.id) {
            var query =
                ' UPDATE employee '
                + ' SET name = ? '
                + '    ,surname = ? '
                + ' WHERE id = ? ';
            var params = [employee.name, employee.surname, employee.id];
        }else{
            query =
                ' INSERT INTO employee '
                + ' (name, surname, team_id) '
                + ' VALUES (?, ?, ?) ';
            params = [employee.name, employee.surname, employee.team_id];
        }

        db.serialize(function () {
            db.run(query, params, function (err) {
                if (err) {
                    done(false);
                }else{
                    done(true);
                }
            });
        });
    });
};
