var Vow = require("vow");
var sqlite = require('./sqlite');
var moment = require('moment');
var maternityLeaveRepository = require('./maternityLeave');
var compensatoryLeaveRepository = require('./compensatoryLeave');

module.exports.getAll = function(user, publicHolidays) {

    return new Vow.Promise(function(resolve, reject){

        var userCondition = '',
            userConditionParams = [],
            _employees,
            db,
            maternityLeave,
            compensatoryLeave;

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(_db){
                db = _db;

                return compensatoryLeaveRepository.getAll();
            })
            .then(function(_compensatoryLeave) {
                compensatoryLeave = _compensatoryLeave;

                return maternityLeaveRepository.getAll();
            })
            .then(function(_maternityLeave) {
                maternityLeave = _maternityLeave;

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

                var employeesDays = {};

                for (var i = 0; i < days.length; i++) {

                    if(!employeesDays.hasOwnProperty(days[i].employee_id)){
                        employeesDays[days[i].employee_id] = {};
                    }

                    employeesDays[days[i].employee_id][days[i].date] = days[i];
                }

                for (i = 0; i < _employees.length; i++) {
                    var e = _employees[i];

                    e.days = {};
                    e.path = '/' + e.team_code + '/';
                    e.maternity_leaves = [];
                    e.compensatory_leaves = [];

                    var iterationDate = moment(e.work_start, "YYYY-MM-DD"),
                        lastWorkingDate = e.work_end ? moment(e.work_end, "YYYY-MM-DD") : moment(),
                        daysWithTypes = employeesDays.hasOwnProperty(e.id) ? employeesDays[e.id] : {},
                        hasMaternityLeave = maternityLeave.hasOwnProperty(e.id),
                        hasCompensatoryLeave = compensatoryLeave.hasOwnProperty(e.id);

                    if(hasMaternityLeave){
                        e.maternity_leaves = maternityLeave[e.id];
                    }

                    if(hasCompensatoryLeave){
                        e.compensatory_leaves = compensatoryLeave[e.id];
                    }

                    do  {

                        var format = iterationDate.format("YYYY-MM-DD"),
                            isWeekend = [6, 7].indexOf(iterationDate.isoWeekday()) != -1,
                            isPublicHoliday = publicHolidays.hasOwnProperty(format),
                            hasType = daysWithTypes.hasOwnProperty(format),
                            isMaternityLeave = false;

                        if(hasMaternityLeave){
                            for(var j = 0; j < e.maternity_leaves.length; j++){
                                if(iterationDate.isBetween(moment(e.maternity_leaves[j].date_start, "YYYY-MM-DD"), moment(e.maternity_leaves[j].date_end_or_today, "YYYY-MM-DD")) || format == e.maternity_leaves[j].date_end_or_today || format == e.maternity_leaves[j].date_start){
                                    isMaternityLeave = true;
                                    break;
                                }
                            }
                        }

                        if(isMaternityLeave){
                            e.days[format] = 11;
                        }
                        else if(hasType){
                            e.days[format] = daysWithTypes[format].day_type_id;
                        }
                        else if(!isWeekend && !isPublicHoliday){
                            e.days[format] = 4;
                        }

                        iterationDate.add(1, 'd');
                    }
                    while (iterationDate.isBefore(lastWorkingDate) || iterationDate.isSame(lastWorkingDate, 'day'));

                    for(j in daysWithTypes){
                        if(daysWithTypes.hasOwnProperty(j) && !e.days.hasOwnProperty(j)){
                            e.days[j] = daysWithTypes[j].day_type_id;
                        }
                    }

                    //employees[_employees[i].id] = e;
                }

                var query = "SELECT e.*, es.*, t.code AS team_code "
                    + "FROM employee e "
                    + "JOIN employee_shift es ON e.id = es.employee_id "
                    + "JOIN team t ON e.team_id = t.id "
                    + userCondition;

                return sqlite.all(db, query, userConditionParams);
            })
            .then(function(shifts){

                var employees = {},
                    employeesShifts = {};

                for (var i = 0; i < shifts.length; i++) {

                    if(!employeesShifts.hasOwnProperty(shifts[i].employee_id)){
                        employeesShifts[shifts[i].employee_id] = {};
                    }

                    employeesShifts[shifts[i].employee_id][shifts[i].date] = shifts[i];
                }

                for (i = 0; i < _employees.length; i++) {
                    var e = _employees[i];

                    e.shifts = {};

                    var lastDate = moment(),
                        firstDate = moment(),
                        firstWorkingDay = moment(e.work_start, "YYYY-MM-DD");

                    firstDate.subtract(2, 'M');
                    lastDate.add(2, 'M');

                    var iterationDate = firstWorkingDay.isBefore(firstDate) ? firstDate : firstWorkingDay,
                        lastWorkingDate = (e.work_end && e.work_end != 'null') ? moment(e.work_end, "YYYY-MM-DD") : lastDate,
                        daysWithShifts = employeesShifts.hasOwnProperty(e.id) ? employeesShifts[e.id] : {};

                    do  {

                        var format = iterationDate.format("YYYY-MM-DD"),
                            isWeekend = [6, 7].indexOf(iterationDate.isoWeekday()) != -1,
                            isPublicHoliday = publicHolidays.hasOwnProperty(format),
                            hasType = daysWithShifts.hasOwnProperty(format);

                        if(hasType){
                            e.shifts[format] = daysWithShifts[format].shift_id;
                        }
                        else if(isWeekend || isPublicHoliday){
                            e.shifts[format] = 4;
                        }
                        else {
                            e.shifts[format] = 1;
                        }

                        iterationDate.add(1, 'd');
                    }
                    while (iterationDate.isBefore(lastWorkingDate) || iterationDate.isSame(lastWorkingDate, 'day'));

                    for(var j in daysWithShifts){
                        if(daysWithShifts.hasOwnProperty(j) && !e.shifts.hasOwnProperty(j)){
                            e.shifts[j] = daysWithShifts[j].shift_id;
                        }
                    }

                    employees[_employees[i].id] = e;
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
                        + '    ,position = ? '
                        + '    ,work_start = ? '
                        + '    ,work_end = ? '
                        + ' WHERE id = ? ';
                    var params = [employee.name, employee.surname, employee.position, employee.work_start, employee.work_end, employee.id];
                }
                else{
                    query =
                        ' INSERT INTO employee '
                        + ' (name, surname, position, work_start, work_end, team_id) '
                        + ' VALUES (?, ?, ?, ?, ?, ?) ';
                    params = [employee.name, employee.surname, employee.position, employee.work_start, employee.work_end, employee.team_id];
                }

                return sqlite.run(db, query, params);
            })
            .then(function(){

                var promises = [];

                for(var i = 0; i < employee.maternity_leaves.length; i++){
                    promises.push(maternityLeaveRepository.update(employee.maternity_leaves[i]));
                }

                for(i = 0; i < employee.compensatory_leaves.length; i++){
                    promises.push(compensatoryLeaveRepository.update(employee.compensatory_leaves[i]));
                }

                return Vow.all(promises);
            })
            .then(resolve)
            .catch(reject);
    });
};
