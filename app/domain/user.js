var sqlite = require('./sqlite');


module.exports.findById = function(id, done) {

    sqlite.connect()
        .then(sqlite.serialize)
        .then(function(db) {

            sqlite.get(db, "SELECT * FROM user WHERE id = ?", id)
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
            sqlite.get(db, "SELECT * FROM user WHERE name = ? AND password = ?", [username, password])
                .then(function (user) {
                    done(null, user);
                })
                .catch(function(){
                    done(null, false, {message: 'Incorrect password.'});
                });
        });
};
