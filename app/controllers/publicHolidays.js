var url = require('url');
var publicHolidayRepository = require('../domain/publicHoliday');

module.exports.update = function(request, response){

    var dates = request.body;

    publicHolidayRepository.toggleDates(dates)
        .then(function(){

            var body = JSON.stringify({success: true});

            response.writeHead(200, {
                "content-type": "application/json",
                "content-length": body.length
            });

            response.write(body);
            response.end();

        })
        .catch(function(){
            response.writeHead(400, {});
            response.write('Action failed');
            response.end();
        });
};
