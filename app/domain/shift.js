var Vow = require("vow");
var sqlite = require('./sqlite');

module.exports.getAll = function(){

    return new Vow.Promise(function(resolve, reject){

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db) {
                return sqlite.all(db, "SELECT * FROM shift");
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

module.exports.setShifts = function(employeeDayQueryAmend, values){
    return new Vow.Promise(function(resolve, reject) {

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function (db) {
                return sqlite.run(db, "INSERT OR REPLACE INTO employee_shift (employee_id, date, shift_id) VALUES " + employeeDayQueryAmend.toString(), values);
            })
            .then(resolve)
            .catch(reject);
    });
};

module.exports.getTeamShifts = function(){
    return new Vow.Promise(function(resolve, reject){

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db) {
                return sqlite.all(db, "SELECT * FROM team_shift");
            })
            .then(function(_shifts) {

                var shifts = {};

                for(var i = 0; i < _shifts.length; i++) {

                    if(!shifts.hasOwnProperty(_shifts[i].team_id)){
                        shifts[_shifts[i].team_id] = {};
                    }

                    shifts[_shifts[i].team_id][_shifts[i].shift_id] = _shifts[i];
                }

                resolve(shifts);
            })
            .catch(reject);
    });
};