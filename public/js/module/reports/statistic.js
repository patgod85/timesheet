var ui = require("basis.ui");
var data = require("basis.data");

module.exports = ui.Node.subclass({
    name: 'Statistic',
    template: resource('./template/statistic.tmpl'),
    childClass: ui.Node.subclass({
        template: '<tr><td>{team_code}</td><td>{name} {surname}</td><td class="aright">{otguls}</td></tr>',
        binding: {
            name: "data:",
            surname: "data:",
            team_code: "data:",
            otguls: "data:"
        }
    }),
    init: function(){

        ui.Node.prototype.init.call(this);

        var dataSource = new data.Dataset({
            items: data.wrap(this.data.employees, true)
        });

        var nodeDataSource = dataSource.getItems().map(function(item){

            var count = 0;

            for(var i in item.data.days){

                if(item.data.days.hasOwnProperty(i)){
                    if(item.data.days[i] == 1){
                        count--;
                    }

                    if(item.data.days[i] == 8){
                        count++;
                    }

                }
            }

            for(i = 0; i < item.data.compensatory_leaves.length; i++){
                count += item.data.compensatory_leaves[i].value;
            }

            item.data.otguls = count;

            return item;
        });

        this.setChildNodes(nodeDataSource);
    }
});