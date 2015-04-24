var ajax = require('basis.net.ajax');
var router = basis.require('basis.router');

var Toolbox = require('./module/toolbox/index.js');
var User = require('./module/user/index.js');
var Pages = require('./module/pages/index.js');
var Page1 = require('./module/pages/pagePublicHolidays.js');
var Page2 = require('./module/pages/pageTeam.js');
var Page3 = require('./module/pages/pageAdmin.js');

var pages;

var modelUrl = '/model';

var model = new basis.data.Object({
    data: {
        month: 'March',
        year: 2015,
        team: '',
        teams: [],
        publicHolidays: {},
        dayTypes: {},
        employeesByTeams: undefined,
        user: {}
    },
    sync: function(done){
        var self = this;

        ajax.request({
            url: modelUrl,
            method: 'GET',
            handler: {
                success: function(transport, request, response){
                    response.Team = require("./module/team/entity.js");
                    response.Employee = require("./module/employee/entity.js");
                    response.Team.all.sync(response.teams);
                    response.Employee.all.sync(response.employees);

                    response.employeesByTeams = new basis.data.dataset.Split({
                        source:
                            new basis.data.dataset.Merge({
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

                    self.update(response);

                    if(!!(done && done.constructor && done.call && done.apply)){
                        done();
                    }
                }
            }
        });
    }
});

new User({
    authCallback: function(user){

        model.update({user: user});

        model.sync(function(){

            router.start();

            new Toolbox({delegate: model});

            pages = new Pages({
                delegate: model,
                router: router,
                childNodes: [
                    Page1,
                    Page2,
                    Page3
                ]
            });
        });
    }
});
