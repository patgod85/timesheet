require('basis.ui');
var moment = require('../../../components/moment/moment.js');
var ajax = require('basis.net.ajax');
var router = basis.require('basis.router');

var agendaConstructor = require('./module/agenda/index.js');
var publicHolidayConstructor = require('./module/public-holidays/year/index.js');
var Toolbox = require('./module/toolbox/index.js');
var UserConstructor = require('./module/user/index.js');

var toolboxData = {
    month: 'February',
    year: '2014',
    team: ''
};

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
                    var teamConstructor = require('./module/team/index.js');
                    currentTeam = teamConstructor(toolboxData.team, toolboxData.month, toolboxData.year, currentTeam);
                }
            }
        });
    }

    //console.log(postModel);
}

var toolbox = new Toolbox({data: toolboxData});

var user = new UserConstructor();

var currentTeam;
router.start();
router.add('team/:team/:month/:year', {
    enter: function(){},
    match: function(teamCode, month, year){

        toolboxData.month = month;
        toolboxData.year = year;
        toolboxData.team = teamCode;

        toolbox.data.year = year;
        toolbox.updateBind('year');

        var teamConstructor = require('./module/team/index.js');

        if(typeof currentTeam === 'undefined'){
            basis.dom.get('placeHolder').innerHTML = "";
            currentTeam = teamConstructor(teamCode, month, year, currentTeam);
            agendaConstructor(applyTypeForSelectedDays);
        }else{
            currentTeam = teamConstructor(teamCode, month, year, currentTeam);
        }


    },
    leave: function(){}
});
router.add('public-holidays/:month/:year', {
    enter: function(){},
    match: function(month, year){
        document.getElementById('placeHolder').innerHTML = "";
        currentTeam = undefined;
        publicHolidayConstructor(month, year);
    },
    leave: function(){}
});