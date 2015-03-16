var url = require('url');
var teamRepository = require('../domain/team');
var employeeRepository = require('../domain/employee');

module.exports.update = function(request, response){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/timesheet.sqlite3', function () {

        var employee = request.body;

        teamRepository.areEmployeesAllowedToChange(request.user, [employee.id], function(isSuccess){

            if(!isSuccess){
                response.writeHead(403, {});
                response.write('ASafsdbdfs');
                response.end();
            }
            else{

                employeeRepository.update(employee, function(success){

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
