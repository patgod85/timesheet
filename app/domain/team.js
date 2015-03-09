module.exports.getAll = function(user, done) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        var userCondition = '',
            userConditionParams = [];

        if(!user.is_super){
            userCondition = ' WHERE id = ? ';
            userConditionParams = [user.team_id];
        }

        db.serialize(function () {
            db.all("SELECT *, code AS team_code, '/' AS path FROM team " + userCondition, userConditionParams, function (err, teams) {

                if (err) {
                    done(null, 'Error');
                }

                done(teams);

            });
        });
    });
};

module.exports.getAll2 = function(user, done) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        var userCondition = '',
            userConditionParams = [];

        if(!user.is_super){
            userCondition = ' WHERE id = ? ';
            userConditionParams = [user.team_id];
        }

        db.serialize(function () {
            db.all("SELECT * FROM team " + userCondition, userConditionParams, function (err, _teams) {

                if (err) {
                    done(null, 'Error');
                }

                var teams = {};

                for(var i = 0; i < _teams.length; i++){
                    teams[_teams[i].code] = _teams[i];
                }

                require('./employee').getAll(user, function(teamsByCode){
                    if(teamsByCode === null){
                        done(null, 'Error');
                    }

                    for(var i in teamsByCode){
                        if(teamsByCode.hasOwnProperty(i)){
                            teams[i].employees = teamsByCode[i].employees;
                        }
                    }

                    done(teams);
                });

            });
        });
    });
};

module.exports.isAllowedToChange = function(user, employee_ids, done){

    if(user.is_super){
        done(true);
    }else{

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

            var query =
                ' SELECT count(e.id) AS cnt '
                + ' FROM user u '
                + ' JOIN employee e ON e.team_id = u.team_id '
                + ' WHERE '
                + ' e.id IN (' + employee_ids.map(function(e){return parseInt(e, 10)}).join(',') + ') '
                + ' AND u.id = ? ';

            db.serialize(function () {
                db.get(query, [user.id], function (err, result) {

                    if (err || result['cnt'] != employee_ids.length) {
                        done(false);
                    }else{
                        done(true);
                    }
                });
            });
        });
    }
};
