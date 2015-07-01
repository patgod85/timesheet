var url = require('url');
var teamRepository = require('../domain/team');
var employeeRepository = require('../domain/employee');

module.exports.update = function(request, response){

    var employee = request.body;

    teamRepository.areEmployeesAllowedToChange(request.user, [employee.id])
        .then(function(){

            employeeRepository.update(employee)
                .then(function(){
                    var body = JSON.stringify({success: true});

                    response.writeHead(200, {
                        "content-type": "application/json",
                        "content-length": body.length
                    });

                    response.write(body);
                    response.end();
                })
                .catch(function(reason){
                    console.log(reason);
                    response.writeHead(400);
                    response.write('Error');
                    response.end();
                })

        })
        .catch(function(){
            response.writeHead(403, {});
            response.write('Access denied');
            response.end();
        })


};
