require('basis.dom');
require('basis.ui');
var Month = require('../month/index.js');

var Employee = require('../employee/index.js');

module.exports = new basis.ui.Node.subclass({
    name: 'Team',
    template: resource('./template/index.tmpl'),
    binding: {
        name: 'name',
        code: 'data:team'
    },
    childFactory: function(config){
        if(config.hasOwnProperty('entity')){
            return new Employee({data: config});
        }

        return new Month({data: config});
    },
    handler: {
        update: function(){
            var arr = [{month: this.data.month, year: this.data.year}];

            if(this.data.teams.hasOwnProperty(this.data.team)) {
                var team = this.data.teams[this.data.team];
                for (var i in team.employees) {
                    if (team.employees.hasOwnProperty(i)) {
                        arr.push(
                            {entity: team.employees[i], month: this.data.month, year: this.data.year}
                        )
                    }
                }
            }

            this.setChildNodes(arr);
        }
    }
});
