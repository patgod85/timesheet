module.exports.getAll = function(user, done) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/example.sqlite3', function () {

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

module.exports.isTeamAllowedToChange = function(user, teamId, done){
    done(user.is_super || user.team_id == teamId);
};
module.exports.areEmployeesAllowedToChange = function(user, employee_ids, done){

    if(user.is_super){
        done(true);
    }else{

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/example.sqlite3', function () {

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

module.exports.update = function(team, done){

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/example.sqlite3', function () {

        if(team.id) {
            var query =
                ' UPDATE team '
                + ' SET name = ? '
                + ' WHERE id = ? ';
            var params = [team.name, team.id];
        }
        else{
            query =
                ' INSERT INTO team '
                + ' (name, code) '
                + ' VALUES (?, ?) ';
            params = [team.name, team.code];

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
