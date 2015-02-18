var url = require('url');

module.exports = function(viewModel){
    return function(request, response) {

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

            db.serialize(function () {

                db.all("SELECT * FROM public_holiday", function (holidaysErr, holidays) {

                    if (holidaysErr) {
                        response.writeHead(500, {"Content-Type": "text/html"});
                        response.write('There is a problem' + JSON.stringify(holidaysErr));
                        response.end();
                        return;
                    }

                    for(var i = 0; i < holidays.length; i++){
                        viewModel[holidays[i].date.trim()] = holidays[i];
                    }

                    var body = JSON.stringify(viewModel);
//console.log(body);
                    response.writeHead(200, {
                        "content-type": "application/json",
                        "content-length": body.length
                    });

                    response.write(body);
                    response.end();
                });
            });
        });
    }
};
