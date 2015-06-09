var bcrypt = require('bcrypt-nodejs');
var Vow = require("vow");
var sqlite = require('./sqlite');

var publicFields = [
    'id',
    'email',
    'name',
    'surname',
    'team_id',
    'is_super',
    'is_enabled'
];

function encodePassword(password){
    return new Vow.Promise(function(resolve){

        if(!password){
            resolve('');
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, null, function(err, hash) {
                resolve(hash);
            });
        });
    });
}

module.exports.isSuper = function(user){
    return new Vow.Promise(function(resolve, reject){
        if(user.is_super){
            resolve();
        }
        else {
            reject('User is not the super');
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

function findByNameAndPassword(username, password) {

    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function (db) {
                sqlite.get(db, "SELECT " + publicFields.join(",") + ", password FROM user WHERE email = ?", [username])
                    .then(function (user) {

                        bcrypt.compare(password, user.password, function (err, res) {
                            if (res) {
                                delete user.password;
                                resolve(user);
                            } else {
                                reject('Incorrect password');
                            }
                        });
                    })
                    .catch(function () {
                        reject('Incorrect username');
                    });
            });
    });
}

module.exports.findByNameAndPassword = findByNameAndPassword;

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

module.exports.updateBySuperUser = function(user){


    return new Vow.Promise(function(resolve, reject) {

        var db;

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(_db){
                db = _db;
                return encodePassword(user.new_password);
            })
            .then(function(hash){

                if(user.id){
                    var query =
                        ' UPDATE user '
                        + ' SET email = ? '
                        + '    ,name = ? '
                        + '    ,surname = ? '
                        + '    ,is_super = ? '
                        + '    ,is_enabled = ? ';
                    var params = [user.email, user.name, user.surname, !!user.is_super, !!user.is_enabled];

                    if(hash){
                        query += ',password = ? ';
                        params.push(hash);
                    }

                    query += ' WHERE id = ? ';
                    params.push(user.id);

                }
                else{
                    query =
                        ' INSERT INTO user '
                        + ' (email, name, surname, is_super, team_id, password) '
                        + ' VALUES (?, ?, ?, ?, ?, ?) ';
                    params = [user.email, user.name, user.surname, user.is_super, user.team_id, hash];
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

module.exports.update = function(user, userModel){

    if(userModel.new_password){

        return new Vow.Promise(function(resolve, reject) {

            sqlite.connect()
                .then(sqlite.serialize)
                .then(function(db){

                    var query =
                        ' UPDATE user '
                        + ' SET name = ? '
                        + '    ,surname = ? ';
                    var params = [userModel.name, userModel.surname];

                    if(userModel.new_password == userModel.new_password2){
                        findByNameAndPassword(user.email, userModel.old_password)
                            .then(function(){
                                return encodePassword(userModel.new_password);
                            })
                            .then(function(hash){
                                query += ' ,password = ? ';
                                params.push(hash);

                                query += ' WHERE id = ? ';
                                params.push(user.id);

                                return sqlite.run(
                                    db,
                                    query,
                                    params
                                );

                            })
                            .then(resolve)
                            .catch(reject)
                    }else{
                        reject();
                    }
                })
                .catch(reject);
        });

    } else {

        return new Vow.Promise(function(resolve, reject) {

            sqlite.connect()
                .then(sqlite.serialize)
                .then(function(db){

                    var query =
                        ' UPDATE user '
                        + ' SET name = ? '
                        + '    ,surname = ? '
                        + ' WHERE id = ? ';
                    var params = [userModel.name, userModel.surname, user.id];

                    return sqlite.run(
                        db,
                        query,
                        params
                    );
                })
                .then(resolve)
                .catch(reject);
        });
    }


};