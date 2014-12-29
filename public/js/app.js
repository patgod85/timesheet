require('basis.ui');
var router = basis.require('basis.router');

var monthSelectorConstructor = require('./module/month-selector/index.js');
var yearSelectorConstructor = require('./module/year-selector/index.js');
var teamsConstructor = require('./module/teams/index.js');

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

new basis.ui.Node({
    container: document.getElementById('teams'),
    childNodes: [
        monthSelectorConstructor(selectedMonth, changeMonth),
        yearSelectorConstructor(selectedYear, changeYear),
        teamsConstructor(changeTeam)
    ]
});

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