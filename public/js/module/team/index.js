require('basis.dom');
require('basis.ui');
var Month = require('../month/index.js');

var employeeConstructor = require('../employee/index.js');

module.exports = function(teamCode, month, year, existingNode, teams){
    if(typeof existingNode === 'undefined'){
        existingNode = new basis.ui.Node({
            data: {
                name: teamCode
            },
            container: basis.dom.get('placeHolder'),
            //container: document.getElementById('placeHolder'),
            template: resource('./template/index.tmpl'),
            binding: {
                name: 'data:name'
            }
        });
    }

    existingNode.setChildNodes([]);

    if(teams){

        var team = null;

        for(var i in teams){
            if(teams.hasOwnProperty(i)){
                if(teams[i].code == teamCode){
                    team = teams[i];
                    break;
                }
            }
        }

        if(team !== null) {
            var arr = [new Month(month, year, [], false)];
            for (i in team.employees) {
                if (team.employees.hasOwnProperty(i)) {
                    arr.push(employeeConstructor(team.employees[i], month, year));
                }
            }
            existingNode.data.name = team.name;
            existingNode.updateBind('name');
            existingNode.setChildNodes(arr);
        }
    }
    
    return existingNode;
};


