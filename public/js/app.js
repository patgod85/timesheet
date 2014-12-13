require('basis.ui');

new basis.ui.Node({
    container: document.getElementById('teams'),
    childNodes: [
        require('./module/teams/index.js')
    ]
});

var router = basis.require('basis.router');
var currentTeam;
router.start();
router.add('team/:id', {
    enter: function(){},
    match: function(id){
        var teamConstructor = require('./module/team/index.js');
        currentTeam = teamConstructor(id, currentTeam);
    },
    leave: function(){}
});