
module.exports = basis.ui.Node.subclass({
    name: 'Statistic',
    template: resource('./template/statistic.tmpl'),
    childClass: basis.ui.Node.subclass({
        template: '<tr><td>{team_code}</td><td>{name} {surname}</td><td class="aright">{otguls}</td></tr>',
        binding: {
            name: "data:",
            surname: "data:",
            team_code: "data:",
            otguls: "data:"
        }
    }),
    init: function(){

        basis.ui.Node.prototype.init.call(this);

        var dataSource = new basis.data.Dataset({
            items: basis.data.wrap(this.data.employees, true)
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

            item.data.otguls = count;

            return item;
        });

        this.setChildNodes(nodeDataSource);
    }
});