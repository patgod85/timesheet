var Vow = require("vow");
var sqlite = require('./sqlite');

module.exports.getAll = function(user) {

    return new Vow.Promise(function(resolve, reject){

        var userCondition = '',
            userConditionParams = [],
            _employees,
            db;

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(_db) {

                db = _db;

                if(!user.is_super){
                    userCondition = ' WHERE t.id = ? ';
                    userConditionParams = [user.team_id];
                }

                var query = "SELECT e.*, t.code AS team_code "
                    + "FROM employee e "
                    + "JOIN team t ON e.team_id = t.id "
                    + userCondition;

                return sqlite.all(db, query, userConditionParams);
            })
            .then(function (employees) {

                _employees = employees;

                var query = "SELECT e.*, ed.*, t.code AS team_code "
                    + "FROM employee e "
                    + "JOIN employee_day ed ON e.id = ed.employee_id "
                    + "JOIN team t ON e.team_id = t.id "
                    + userCondition;

                return sqlite.all(db, query, userConditionParams);
            })
            .then(function (days) {

                var employees = {};

                for (var i = 0; i < _employees.length; i++) {
                    employees[_employees[i].id] = _employees[i];
                    employees[_employees[i].id].days = {};
                    employees[_employees[i].id].path = '/' + employees[_employees[i].id].team_code + '/';
                }

                for (i = 0; i < days.length; i++) {
                    employees[days[i].employee_id].days[days[i].date] = (days[i]);
                }

                resolve(
                    Object.keys(employees)
                        .map(function (key) {
                            return employees[key]
                        })
                );
            })
            .catch(reject)
    });
};

module.exports.update = function(employee){

    return new Vow.Promise(function(resolve, reject){

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db) {

                if(employee.id){
                    var query =
                        ' UPDATE employee '
                        + ' SET name = ? '
                        + '    ,surname = ? '
                        + '    ,work_start = ? '
                        + '    ,work_end = ? '
                        + ' WHERE id = ? ';
                    var params = [employee.name, employee.surname, employee.work_start, employee.work_end, employee.id];
                }
                else{
                    query =
                        ' INSERT INTO employee '
                        + ' (name, surname, work_start, work_end, team_id) '
                        + ' VALUES (?, ?, ?, ?, ?) ';
                    params = [employee.name, employee.surname, employee.work_start, employee.work_end, employee.team_id];
                }

                return sqlite.run(db, query, params);
            })
            .then(resolve)
            .catch(reject);
    });
};
