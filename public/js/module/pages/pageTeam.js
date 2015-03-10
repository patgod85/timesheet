
var ajax = require('basis.net.ajax');
var moment = require('../../../components/moment/moment.js');

var Page = require('./page.js');
var Team = require('../team/index.js');
var Agenda = require('../agenda/index.js');

module.exports = Page.subclass({
    name: 'teamPage',
    emit_applyDayType: basis.event.create('applyDayType', 'typeId'),
    handler: {
        applyDayType: function (sender, typeId) {
            applyTypeForSelectedDays(this.getChildByName('Team'), typeId, this.delegate);
        }
    },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        this.setChildNodes([
            new Team({delegate: this.delegate}),
            new Agenda({ dayTypes: this.data.dayTypes })
        ]);

        var self = this;

        this.router.add('team/:team/:month/:year', {
            match: function(teamCode, month, year){
                var data = {
                    team: teamCode,
                    month: month,
                    year: year + ' ' // Very strange bug. Without this space delegate does not change
                };

                self.update(data);

                self.select();

                self.getChildByName('Team').setDataSource(self.data.employeesByTeams.getSubset('/' + teamCode + '/'));
            }
        });
    }
});

function applyTypeForSelectedDays(currentTeam, typeId, model){
    var postModel = [];
    var childNodes = currentTeam.childNodes;
    var checkedDays = [];

    for(var i = 0; i < childNodes.length; i++){
        var employee = childNodes[i];
        if(employee.constructor.className == 'Employee') {

            for(var j = 0; j < employee.childNodes.length; j++){

                var month = employee.childNodes[j];
                if(month.constructor.className == 'Month') {
                    var days = month.childNodes;

                    for(var k = 0; k < days.length; k++){
                        if(days[k].data.checked){
                            checkedDays.push(days[k]);
                            postModel.push({
                                id: employee.data.id,
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
            contentType: "application/json",
            postBody: JSON.stringify(postModel),
            handler: {
                success: function(){
                    for(var i = 0; i < checkedDays.length; i++){
                        checkedDays[i].data.checked = false;
                        checkedDays[i].updateBind('checked');
                    }
                    model.sync();
                },
                failure: function(){
                    alert("Setting of day type failed");
                }
            }
        });
    }
}
