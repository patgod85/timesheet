var Vow = require("vow");

module.exports.connect = function(path){
    return new Vow.Promise(function(resolve) {
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(path, function(){
            resolve(db)
        });
    });
};

module.exports.serialize = function(db){
    return new Vow.Promise(function(resolve){
        db.serialize(function(){
            resolve(db);
        });
    })
};

module.exports.run = function(db, query, params){
    return new Vow.Promise(function(resolve, reject){
        db.run(query, params, function (err) {
            if (err != null || err) {
                reject(err);
            }else{
                resolve();
            }
        });
    })
};

module.exports.all = function(db, query, params){
    return new Vow.Promise(function(resolve, reject){
        db.all(query, params, function (err, data) {
            if (err != null || err) {
                reject(err);
            }else{
                resolve(data);
            }
        });
    })
};
