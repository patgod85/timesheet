var url = require('url');
var teamRepository = require('../domain/team');

module.exports.update = function(request, response){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/example.sqlite3', function () {

        var team = request.body;

        teamRepository.isTeamAllowedToChange(request.user, team.id, function(isSuccess){

            if(!isSuccess){
                response.writeHead(403, {});
                response.write('ASafsdbdfs');
                response.end();
            }
            else{

                teamRepository.update(team, function(success){

                    var body = JSON.stringify({success: success});

                    response.writeHead(200, {
                        "content-type": "application/json",
                        "content-length": body.length
                    });

                    response.write(body);
                    response.end();
                });
            }
        });

    });
};
