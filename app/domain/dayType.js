module.exports.getAll = function(done){

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {

            db.all("SELECT * FROM day_type", function (err, _types) {

                if (err) {
                    done(null, err);
                }

                var types = {};

                for(var i = 0; i < _types.length; i++){
                    types[_types[i].id] = _types[i];
                }

                done(types);
            });
        });
    });
};
