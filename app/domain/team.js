var Vow = require("vow");
var sqlite = require('./sqlite');

module.exports.getAll = function(user) {

    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db) {

                var userCondition = '',
                    userConditionParams = [];

                if (!user.is_super) {
                    userCondition = ' WHERE id = ? ';
                    userConditionParams = [user.team_id];
                }

                return sqlite.all(db, "SELECT *, code AS team_code, '/' AS path FROM team " + userCondition, userConditionParams);
            })
            .then(resolve)
            .catch(reject);
    });
};

module.exports.isTeamAllowedToChange = function(user, teamId){
    return new Vow.Promise(function(resolve, reject) {
        if(user.is_super || user.team_id == teamId){
            resolve();
        }
        else{
            reject();
        }
    });
};

module.exports.areEmployeesAllowedToChange = function(user, employee_ids){

    return new Vow.Promise(function(resolve, reject) {

        if(user.is_super){
            resolve();
        }
        else{

            sqlite.connect()
                .then(sqlite.serialize)
                .then(function(db) {

                    var query =
                        ' SELECT count(e.id) AS cnt '
                        + ' FROM user u '
                        + ' JOIN employee e ON e.team_id = u.team_id '
                        + ' WHERE '
                        + ' e.id IN (' + employee_ids.map(function (e) {
                            return parseInt(e, 10)
                        }).join(',') + ') '
                        + ' AND u.id = ? ';

                    return sqlite.get(db, query, [user.id]);
                })
                .then(function(result){

                    if (result['cnt'] == employee_ids.length) {
                        resolve();
                    } else {
                        reject('Count is not correct');
                    }
                })
                .catch(reject);
        }
    });
};

module.exports.update = function(team){

    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db) {

                if (team.id) {
                    var query =
                        ' UPDATE team '
                        + ' SET name = ? '
                        + ' WHERE id = ? ';
                    var params = [team.name, team.id];
                }
                else {
                    query =
                        ' INSERT INTO team '
                        + ' (name, code) '
                        + ' VALUES (?, ?) ';
                    params = [team.name, team.code];
                }

                return sqlite.run(db, query, params);
            })
            .then(resolve)
            .catch(reject);
    });
};
