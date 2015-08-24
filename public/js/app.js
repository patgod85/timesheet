
/** @cut */ require('basis.devpanel');

var moment = require('../components/moment/moment.js');
var ajax = require('basis.net.ajax');
var router = require('basis.router');
var data = require("basis.data");
var dataset = require("basis.data.dataset");

var Toolbox = require('./module/toolbox/index.js');
var User = require('./module/user/index.js');
var Pages = require('./module/pages/index.js');
var Page1 = require('./module/pages/pagePublicHolidays.js');
var Page2 = require('./module/pages/pageTeam.js');
var Page3 = require('./module/pages/pageAdmin.js');
var Page4 = require('./module/pages/pageReports.js');
var Page5 = require('./module/pages/pageProfile.js');

var pages;

var modelUrl = '/app/model';

var model = new data.Object({
    data: {
        month: moment().format('MMMM'),
        year: moment().format('YYYY'),
        mode: 'days',
        team: '',
        teams: [],
        publicHolidays: {},
        dayTypes: {},
        employeesByTeams: undefined,
        employeesAndUsersByTeams: undefined,
        user: {}
    },
    setAndDestroyRemoved: function(done){
        var self = this;

        ajax.request({
            url: modelUrl,
            method: 'GET',
            handler: {
                success: function(transport, request, response){
                    response.Team = require("./module/team/entity.js");
                    response.Employee = require("./module/employee/entity.js");
                    response.User = require("./module/user/entity.js");
                    response.Team.all.setAndDestroyRemoved(response.teams);
                    response.Employee.all.setAndDestroyRemoved(response.employees);
                    response.User.all.setAndDestroyRemoved(response.users || []);

                    response.employeesByTeams = new dataset.Split({
                        source:
                            new dataset.Merge({
                                sources: [
                                    response.Team.all,
                                    response.Employee.all
                                ]
                            }),
                        rule:
                            function(object){
                                return object.data.path;
                            }
                    });

                    response.employeesAndUsersByTeams = new dataset.Split({
                        source:
                            new dataset.Merge({
                                sources: [
                                    response.Team.all,
                                    response.Employee.all,
                                    response.User.all
                                ]
                            }),
                        rule:
                            function(object){
                                return object.data.path;
                            }
                    });

                    self.update(response);

                    if(!!(done && done.constructor && done.call && done.apply)){
                        done();
                    }
                }
            }
        });
    }
});

new Toolbox({delegate: model});

new User({
    authCallback: function(user){

        model.update({user: user});

        model.setAndDestroyRemoved(function(){

            router.start();

            pages = new Pages({
                delegate: model,
                router: router,
                childNodes: [
                    Page1,
                    Page2,
                    Page3,
                    Page4,
                    Page5
                ]
            });
        });
    }
});
