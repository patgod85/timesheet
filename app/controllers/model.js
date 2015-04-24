var url = require('url');
var Vow = require("vow");

var dayTypeRepository = require('../domain/dayType');
var publicHolidayRepository = require('../domain/publicHoliday');
var employeeRepository = require('../domain/employee');
var teamRepository = require('../domain/team');

module.exports = function (request, response) {


    var promise = new Vow.Promise(function(resolve, reject) {

        var model = {};

        teamRepository.getAll(request.user)
            .then(function (teams) {
                model.teams = teams;

                return employeeRepository.getAll(request.user);
            })
            .then(function (employees) {
                model.employees = employees;

                return publicHolidayRepository.getAll();
            })
            .then(function (publicHolidays) {

                model.publicHolidays = publicHolidays;

                return dayTypeRepository.getAll()
            })
            .then(function (types) {

                model.dayTypes = types;

                resolve(model);
            })
            .catch(function () {
                reject('Fail on fetching of model');
            });
    });


    promise
        .then(function(model){
            var body = JSON.stringify(model);

            response.writeHead(200, {
                "content-type": "application/json",
                "content-length": body.length
            });

            response.write(body);
            response.end();
        })
        .catch(function(message){
            response.writeHead(500, {"Content-Type": "text/html"});
            response.write(message);
            response.end();
        })

};
