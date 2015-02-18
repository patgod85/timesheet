var url = require('url');

module.exports = function (request, response) {

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        var postData = request.body;

        var dates = [];
        var dayQueryAmend = [];
        var employeeDayQueryAmend = [];
        for(var i = 0; i < postData.length; i++){
            dates.push(postData[i].date);
            dayQueryAmend.push('(?)');
            employeeDayQueryAmend.push("(?,?,?)");
        }

        db.run("INSERT OR IGNORE INTO day (date) VALUES " + dayQueryAmend.toString(), dates, function(){

            var param = dates.map(function (date) {
                return "'" + date + "'"
            }).toString();

            db.all("SELECT * FROM day WHERE date IN (" + param + ")", function(err, existingDates){

                var datesIds = {};
                for(var i = 0; i < existingDates.length; i++){
                    datesIds[existingDates[i].date] = existingDates[i].id;
                }
                var values = [];
                for(i = 0; i < postData.length; i++){
                    values.push(postData[i].id);
                    values.push(datesIds[postData[i].date]);
                    values.push(postData[i].type);
                }

                db.run("INSERT OR REPLACE INTO employee_day (employee_id, day_id, day_type_id) VALUES " + employeeDayQueryAmend.toString(), values, function() {
                    var body = "OK";
                    response.writeHead(200, {
                        "content-type": "text",
                        "content-length": body.length
                    });

                    response.write(body);
                    response.end();
                });
            });

        });

    });
};
