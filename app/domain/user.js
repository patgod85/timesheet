var Vow = require("vow");
var sqlite = require('./sqlite');

var publicFields = [
    'id',
    'name',
    'surname',
    'team_id',
    'is_super'
];

module.exports.isSuper = function(user){
    return new Vow.Promise(function(resolve, reject){
        if(user.is_super){
            resolve();
        }
        else{
            reject();
        }
    })
};

module.exports.findById = function(id, done) {

    sqlite.connect()
        .then(sqlite.serialize)
        .then(function(db) {

            sqlite.get(db, "SELECT " + publicFields.join(",") + " FROM user WHERE id = ?", id)
                .then(function(user) {
                    done(null, user);
                })
                .catch(function(){
                    done(null, false, {message: 'Incorrect password.'});
                })
        });
};

module.exports.findByNameAndPassword = function(username, password, done) {

    sqlite.connect()
        .then(sqlite.serialize)
        .then(function(db) {
            sqlite.get(db, "SELECT " + publicFields.join(",") + ", password FROM user WHERE name = ? AND password = ?", [username, password])
                .then(function (user) {
                    done(null, user);
                })
                .catch(function(){
                    done(null, false, {message: 'Incorrect password.'});
                });
        });
};

module.exports.getAll = function() {

    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function (db) {

                return sqlite.all(
                    db,
                    "SELECT " + publicFields.map(function(field){return "u."+field}).join(",") + ", t.code AS team_code " +
                    "FROM " +
                        "user u " +
                        "JOIN team t ON u.team_id = t.id"
                );
            })
            .then(function(users){
                resolve(users.map(function(user){
                    user.path = '/' + user.team_code + '/';
                    return user;
                }));
            })
            .then(resolve)
            .catch(reject);

    });
};

module.exports.update = function(user){

    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db){

                if(user.id){
                    var query =
                        ' UPDATE user '
                        + ' SET name = ? '
                        + '    ,surname = ? '
                        + '    ,is_super = ? '
                        + ' WHERE id = ? ';
                    var params = [user.name, user.surname, !!user.is_super, user.id];
                }
                else{
                    query =
                        ' INSERT INTO user '
                        + ' (name, surname, is_super, team_id) '
                        + ' VALUES (?, ?, ?, ?) ';
                    params = [user.name, user.surname, user.is_super, user.team_id];
                }
                
                return sqlite.run(
                    db,
                    query,
                    params
                );
            })
            .then(resolve)
            .catch(reject);
    });
};