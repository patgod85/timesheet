var ui = require("basis.ui");

var event = require('basis.event');
var ajax = require('basis.net.ajax');
var moment = require('../../../components/moment/moment.js');

var Page = require('./page.js');
var Team = require('../team/index.js');
var Agenda = require('../agenda/index.js');

module.exports = Page.subclass({
    name: 'teamPage',
    title: 'Team schedule',
    emit_applyDayType: event.create('applyDayType', 'typeId'),
    handler: {
        applyDayType: function (sender, typeId) {
            applyTypeForSelectedDays(this.getChildByName('Team'), typeId, this.delegate);
        }
    },
    childNodes: [
        new Team(),
        new Agenda()
    ],
    init: function(){
        ui.Node.prototype.init.call(this);

        var self = this;

        this.router.add('team/:team/:month/:year/:mode', {
            match: function(teamCode, month, year, mode){
                var data = {
                    team: teamCode,
                    month: month,
                    year: year,
                    mode: mode
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
                                date: moment().month(month.data.name).year(month.data.year).date(days[k].data.day).format('YYYY-MM-DD'),
                                type: typeId
                            });
                        }
                    }
                }
            }
        }
    }

    var url = model.data.mode == 'days' ? '/app/set-type' : '/app/set-shift';

    if(postModel.length) {
        ajax.request({
            url: url,
            method: 'POST',
            contentType: "application/json",
            body: JSON.stringify(postModel),
            handler: {
                success: function(){
                    for(var i = 0; i < checkedDays.length; i++){
                        checkedDays[i].data.checked = false;
                        checkedDays[i].updateBind('checked');
                    }
                    model.setAndDestroyRemoved();
                },
                failure: function(){
                    alert("Setting of shift failed");
                }
            }
        });
    }
}
