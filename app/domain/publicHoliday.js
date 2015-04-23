
var Vow = require("vow");
var sqlite = require('./sqlite');

module.exports.getAll = function(done){

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {

            db.all("SELECT * FROM public_holiday", function (err, holidays) {

                if (err) {
                    done(null, 'Error');
                }

                var viewModel = {};

                for(var i = 0; i < holidays.length; i++){
                    viewModel[holidays[i].date.trim()] = holidays[i];
                }

                done(viewModel);
            });
        });
    });
};



module.exports.toggleDates = function(dates){

    return new Vow.Promise(function(resolve, reject){

        if(!dates.length){
            return reject('No dates passed');
        }

        var newDates = [];
        var db;

        sqlite.connect('db/timesheet.sqlite3')
            .then(sqlite.serialize)
            .then(function(_db){

                db = _db;

                var conditions = dates.map(function(){
                    return "?"
                });

                return sqlite.all(
                    db,
                    "SELECT date FROM public_holiday WHERE date IN (" + conditions.join(',') + ")",
                    dates
                );
            })
            .then(function(existingDates){

                existingDates = existingDates.map(function(date){
                    return date.date;
                });

                newDates = dates.filter(function(date){
                    return existingDates.indexOf(date) == -1;
                });

                var conditions = existingDates.map(function(){
                    return "?"
                });

                return sqlite.run(
                    db,
                    "DELETE FROM public_holiday WHERE date IN (" + conditions.join(',') + ")",
                    existingDates
                );
            })

            .then(function(){

                var conditions = newDates.map(function(){
                    return "(?)"
                });

                return sqlite.run(
                    db,
                    "INSERT OR IGNORE INTO public_holiday (date) VALUES " + conditions.join(','),
                    newDates
                );
            })

            .then(resolve)
            .catch(function(){
                console.log(arguments);
                reject()
            });
    });


};