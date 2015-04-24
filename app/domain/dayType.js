var Vow = require("vow");
var sqlite = require('./sqlite');

module.exports.getAll = function(){

    return new Vow.Promise(function(resolve, reject){

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db) {
                return sqlite.all(db, "SELECT * FROM day_type");
            })
            .then(function(_types) {

                var types = {};

                for(var i = 0; i < _types.length; i++){
                    types[_types[i].id] = _types[i];
                }

                resolve(types);
            })
            .catch(reject);
    });
};

module.exports.setTypes = function(employeeDayQueryAmend, values){
    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function (db) {
                return sqlite.run(db, "INSERT OR REPLACE INTO employee_day (employee_id, date, day_type_id) VALUES " + employeeDayQueryAmend.toString(), values);
            })
            .then(resolve)
            .catch(reject);
    });
};
