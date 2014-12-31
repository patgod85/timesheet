require('basis.ui');
var moment = require('../../../components/moment/moment.js');
var ajax = require('basis.net.ajax');
var router = basis.require('basis.router');

var monthSelectorConstructor = require('./module/month-selector/index.js');
var yearSelectorConstructor = require('./module/year-selector/index.js');
var teamsConstructor = require('./module/teams/index.js');
var agendaConstructor = require('./module/agenda/index.js');

var selectedMonth = 'February';
var selectedYear = '2014';
var selectedTeam = '';

function changeRoute(){
    router.navigate('team/' + selectedTeam + '/' + selectedMonth + '/' + selectedYear);
}

function changeMonth(newSelectedMonth) {
    selectedMonth = newSelectedMonth;
    changeRoute();
}

function changeYear(newSelectedYear) {
    selectedYear = newSelectedYear;
    changeRoute();
}

function changeTeam(newTeam){
    selectedTeam = newTeam;
    changeRoute();
}

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
            postBody: JSON.stringify(postModel),
            handler: {
                success: function(){
                    for(var i = 0; i < checkedDays.length; i++){
                        checkedDays[i].data.checked = false;
                        checkedDays[i].updateBind('checked');
                    }
                    var teamConstructor = require('./module/team/index.js');
                    currentTeam = teamConstructor(selectedTeam, selectedMonth, selectedYear, currentTeam);
                }
            }
        });
    }

    //console.log(postModel);
}

new basis.ui.Node({
    container: document.getElementById('teams'),
    childNodes: [
        monthSelectorConstructor(selectedMonth, changeMonth),
        yearSelectorConstructor(selectedYear, changeYear),
        teamsConstructor(changeTeam)
        //agenda
    ]
});

agendaConstructor(applyTypeForSelectedDays);

var currentTeam;
router.start();
router.add('team/:team/:month/:year', {
    enter: function(){},
    match: function(teamCode, month, year){
        selectedMonth = month;
        selectedYear = year;
        selectedTeam = teamCode;
        var teamConstructor = require('./module/team/index.js');
        currentTeam = teamConstructor(teamCode, month, year, currentTeam);
    },
    leave: function(){}
});