var sqlite3 = require('sqlite3').verbose();


module.exports.findById = function(id, done) {

    var db = new sqlite3.Database('db/example.sqlite3', function () {
        db.get("SELECT * FROM user WHERE id = ?", id, function (userErr, user) {
            if (userErr) {
                done(null, false, {message: 'Incorrect password.'});
            } else {
                done(null, user);
            }
        })
    });
};
module.exports.findByNameAndPassword = function(username, password, done) {

    var db = new sqlite3.Database('db/example.sqlite3', function () {
        db.get("SELECT * FROM user WHERE name = ? AND password = ?", username, password, function (userErr, user) {
            if (userErr) {
                done(null, false, {message: 'Incorrect password.'});
            } else {
                done(null, user);
            }
        })
    });
};
