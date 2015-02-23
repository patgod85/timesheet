
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
