
module.exports.getAll = function(done) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        db.serialize(function () {
            db.all("SELECT * FROM team;", function (err, _teams) {

                if (err) {
                    done(null, 'Error');
                }

                var teams = {};

                for(var i = 0; i < _teams.length; i++){
                    teams[_teams[i].id] = _teams[i];
                }

                require('./employee').getAll(function(teamsById){
                    if(teamsById === null){
                        done(null, 'Error');
                    }

                    for(var i in teamsById){
                        if(teamsById.hasOwnProperty(i)){
                            teams[i].employees = teamsById[i].employees;
                        }
                    }

                    done(teams);
                });

            });
        });
    });
};
