require('basis.ui');
var moment = require('../../../components/moment/moment.js');
var ajax = require('basis.net.ajax');
var router = basis.require('basis.router');
var model;

var agendaConstructor = require('./module/agenda/index.js');
var publicHolidayConstructor = require('./module/public-holidays/year/index.js');
var Toolbox = require('./module/toolbox/index.js');
var UserConstructor = require('./module/user/index.js');
var teamConstructor = require('./module/team/index.js');
var currentTeam;
var toolboxData;

ajax.request({
    url: 'http://localhost:8888/model',
    method: 'GET',
    handler: {
        success: function(transport, request, response){
            model = response;

            toolboxData = {
                month: 'March',
                year: '2015',
                team: '',
                teams: model.teams
            };

            var toolbox = new Toolbox({data: toolboxData});

            new UserConstructor();

            router.start();
            router.add('team/:team/:month/:year', {
                enter: function(){},
                match: function(teamCode, month, year){

                    toolboxData.month = month;
                    toolboxData.year = year;
                    toolboxData.team = teamCode;

                    toolbox.data.year = year;
                    toolbox.updateBind('year');


                    if(typeof currentTeam === 'undefined'){
                        basis.dom.get('placeHolder').innerHTML = "";
                        currentTeam = teamConstructor(teamCode, month, year, currentTeam, model.teams);
                        agendaConstructor(applyTypeForSelectedDays, model.dayTypes);
                    }else{
                        currentTeam = teamConstructor(teamCode, month, year, currentTeam, model.teams);
                    }


                },
                leave: function(){}
            });
            router.add('public-holidays/:month/:year', {
                enter: function(){},
                match: function(month, year){
                    document.getElementById('placeHolder').innerHTML = "";
                    currentTeam = undefined;
                    publicHolidayConstructor(month, year, model.publicHolidays);
                },
                leave: function(){}
            });
        }
    }
});



function applyTypeForSelectedDays(typeId){
    var postModel = [];
    var childNodes = currentTeam.childNodes;
    var checkedDays = [];

    for(var i = 0; i < childNodes.length; i++){
        var employee = childNodes[i];
        if(employee.constructor.className == 'Employee') {
            //console.log('Employee', childNodes[i]);
            for(var j = 0; j < employee.childNodes.length; j++){

                var month = employee.childNodes[j];
                if(month.constructor.className == 'Month') {
                    var days = month.childNodes;
                    for(var k = 0; k < days.length; k++){
                        if(days[k].data.checked){
                            checkedDays.push(days[k]);
                            postModel.push({
                                id: employee.data.entity.id,
                                date: moment().month(month.data.name).year(month.data.year).date(days[k].data.day).format('DD.MM.YYYY'),
                                type: typeId
                            });
                        }
                    }
                }
            }
        }
    }

    if(postModel.length) {
        ajax.request({
            url: 'http://localhost:8888/set-type',
            method: 'POST',
            contentType: "application/json",
            postBody: JSON.stringify(postModel),
            handler: {
                success: function(){
                    for(var i = 0; i < checkedDays.length; i++){
                        checkedDays[i].data.checked = false;
                        checkedDays[i].updateBind('checked');
                    }
                    //currentTeam = teamConstructor(toolboxData.team, toolboxData.month, toolboxData.year, currentTeam, model.teams);
                }
            }
        });
    }
}

