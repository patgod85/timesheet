var url = require('url');
var teamRepository = require('../domain/team');

module.exports.update = function(request, response){

    var team = request.body;

    teamRepository.isTeamAllowedToChange(request.user, team.id)

        .then(function(){

            teamRepository.update(team)
                .then(function(){

                    var body = JSON.stringify({success: true});

                    response.writeHead(200, {
                        "content-type": "application/json",
                        "content-length": body.length
                    });

                    response.write(body);
                    response.end();
                });

        })
        .catch(function(){
            response.writeHead(403, {});
            response.write('Access denied');
            response.end();
        })


};
