require('basis.ui');
var ajax = require('basis.net.ajax');

var employeeConstructor = require('../employee/index.js');

module.exports = function(teamCode, month, year, team){
    if(typeof team === 'undefined'){
        team = new basis.ui.Node({
            data: {
                name: teamCode
            },
            container: document.getElementById('team'),
            template: resource('./template/index.tmpl'),
            binding: {
                name: 'data:name'
            }
        });
    }

    team.setChildNodes([]);

    ajax.request({
        url: 'http://localhost:8888/team/',
        params: {
            code: teamCode
        },
        handler: {
            success: function(transport, request, response){
                var arr = [];
                for(var i in response.employees){
                    if(response.employees.hasOwnProperty(i)){
                        arr.push(employeeConstructor(response.employees[i], month, year));
                    }
                }
                team.data.name = response.team.name;
                team.updateBind('name');
                team.setChildNodes(arr);
            },
            failure: function(transport, request, error){
                console.log('response error:', error);
            }
        }
    });
    return team;
};


