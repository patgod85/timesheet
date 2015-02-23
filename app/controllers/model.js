var url = require('url');

module.exports = function (request, response) {

        function showError(message){
            response.writeHead(500, {"Content-Type": "text/html"});
            response.write(message);
            response.end();
        }

        function showSuccess(){
            var body = JSON.stringify(model);

            response.writeHead(200, {
                "content-type": "application/json",
                "content-length": body.length
            });

            response.write(body);
            response.end();
        }

        var model = {};

        require('../domain/team').getAll(function(teams){
            if(teams === null){
                showError('Fail on fetching of teams');
            }
            model.teams = teams;

            require('../domain/publicHoliday').getAll(function(publicHolidays){

                if(publicHolidays === null){
                    showError('Fail on fetching of public holidays');
                }
                model.publicHolidays = publicHolidays;

                require('../domain/dayType').getAll(function(types){

                    if(types === null){
                        showError('Fail on fetching of days types');
                    }
                    model.dayTypes = types;

                    showSuccess();
                })
            })
        });

};
