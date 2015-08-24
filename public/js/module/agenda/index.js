var ui = require('basis.ui');

module.exports = ui.Node.subclass({
    name: 'Agenda',
    autoDelegate: true,
    template: resource('./template/index.tmpl'),
    childClass: {
        template: resource('./template/item.tmpl'),
        binding: {
            id: 'data:',
            name: 'data:',
            isType: 'data:',
            isShift: 'data:'
        },
        action: {
            applyType: function () {
                this.parentNode.parentNode.emit_applyDayType(this.data.id);
            }
        }
    },
    handler: {
        update: function(){
            var self = this;

            var selectedTeam;

            self.data.teams.map(function(team){
                if(team.code == self.data.team){
                    selectedTeam = team;
                    return false;
                }
            });

            if(self.data.mode == 'days'){
                var arr = Object.keys(self.data.dayTypes).map(function (key) {
                    var data = self.data.dayTypes[key];

                    data.isType = true;
                    data.isShift = false;

                    return {data: data}
                });
            }
            else {
                arr = Object.keys(self.data.shifts).map(function (key) {
                    var data = self.data.shifts[key];

                    data.isType = false;
                    data.isShift = true;
                    data.name = selectedTeam.shifts.hasOwnProperty(data.id) ? selectedTeam.shifts[data.id].description : '';

                    return {data: data}
                });
            }


            self.setChildNodes(
                arr
            );
        }
    }
});
