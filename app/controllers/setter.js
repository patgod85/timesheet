var url = require('url');

var teamRepository = require('../domain/team');
var dayTypeRepository = require('../domain/dayType');
var shiftRepository = require('../domain/shift');

module.exports.setType = function (request, response) {

    setDay(dayTypeRepository.setTypes, request, response);
};


module.exports.setShift = function (request, response) {

    setDay(shiftRepository.setShifts, request, response);
};

function setDay(repositoryMethod, request, response){
    var postData = request.body;

    var dates = [];
    var dayQueryAmend = [];
    var employeeDayQueryAmend = [];
    var employee_ids = [];

    for(var i = 0; i < postData.length; i++){
        dates.push(postData[i].date);
        dayQueryAmend.push('(?)');
        employeeDayQueryAmend.push("(?,?,?)");
        employee_ids.push(postData[i].id);
    }

    teamRepository.areEmployeesAllowedToChange(request.user, employee_ids)
        .then(function() {

            var values = [];
            for (i = 0; i < postData.length; i++) {
                values.push(postData[i].id);
                values.push(postData[i].date);
                values.push(postData[i].type);
            }

            return repositoryMethod(employeeDayQueryAmend, values);
        })
        .then(function () {
            var body = JSON.stringify({success: true});

            response.writeHead(200, {
                "content-type": "application/json",
                "content-length": body.length
            });

            response.write(body);
            response.end();
        })
        .catch(function(){
            response.writeHead(403, {});
            response.write('Access denied');
            response.end();
        })
}
