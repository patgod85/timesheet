require('basis.ui');
var router = basis.require('basis.router');

var monthSelectorConstructor = require('./module/month-selector/index.js');

var selectedMonth = 'February';

var changeMonth = function (newSelectedMonth) {
    selectedMonth = newSelectedMonth;
    router.navigate('team/1/' + selectedMonth);
};

new basis.ui.Node({
    container: document.getElementById('teams'),
    childNodes: [
        monthSelectorConstructor(selectedMonth, changeMonth),
        require('./module/teams/index.js')
    ]
});

var currentTeam;
router.start();
router.add('team/:id/:month', {
    enter: function(){},
    match: function(id, month){
        var teamConstructor = require('./module/team/index.js');
        currentTeam = teamConstructor(id, month, currentTeam);
    },
    leave: function(){}
});