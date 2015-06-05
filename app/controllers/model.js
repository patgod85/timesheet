var url = require('url');
var Vow = require("vow");

var dayTypeRepository = require('../domain/dayType');
var publicHolidayRepository = require('../domain/publicHoliday');
var employeeRepository = require('../domain/employee');
var teamRepository = require('../domain/team');
var userRepository = require('../domain/user');

module.exports = function (request, response) {

    var query = url.parse(request.url, true).query;

    if(query.hasOwnProperty('downgrade-permissions')){
        request.user.is_super = 0;
    }

    var promise = new Vow.Promise(function(resolve, reject) {

        var model = {};

        teamRepository.getAll(request.user)
            .then(function (teams) {
                model.teams = teams;

                return publicHolidayRepository.getAll();
            })
            .then(function (publicHolidays) {

                model.publicHolidays = publicHolidays;

                return employeeRepository.getAll(request.user, publicHolidays);
            })
            .then(function (employees) {
                model.employees = employees;

                return dayTypeRepository.getAll()
            })
            .then(function (types) {

                model.dayTypes = types;

                if(request.user.is_super) {
                    return userRepository.getAll();
                }
                else{
                    resolve(model);
                }
            })
            .then(function (users) {
                model.users = users;

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
