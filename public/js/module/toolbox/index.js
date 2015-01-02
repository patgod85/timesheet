require('basis.ui');
require('basis.ui.calendar');
require('basis.ui.button');
var router = require('basis.router');
var moment = require('../../../components/moment/moment.js');

var teamsConstructor = require('../teams/index.js');
var MyCalendar = basis.ui.calendar.Calendar.subclass({
    childNodes: ['Year', 'YearDecade'],
    handler: {
        change: function () {
            this.owner.emit_monthChange(this.selectedDate.value);
        }
    }
});

module.exports = basis.ui.Node.subclass({
    autoDelegate: true,
    container: basis.dom.get('toolbox'),
    template: resource('./template/index.tmpl'),
    satellite: {
        calendar: {
            instanceOf: MyCalendar,
            config: function(owner){
                console.log(owner.data.year);
                return {
                    date: (new Date).setFullYear(parseInt(owner.data.year))
                }
            }
        }
    },
    binding: {
        calendar: "satellite:calendar",
        button: new basis.ui.button.Button({
            caption: 'Public holidays',
            click: function () {
                router.navigate("public-holidays/" + this.data.year);
            }
        }),
        teamsList: teamsConstructor()
    },
    action: {
        changeRoute: function(data) {
            router.navigate('team/' + data.team + '/' + data.month + '/' + data.year);
        }
    },
    emit_teamChange: basis.event.create('teamChange', 'team'),
    emit_monthChange: basis.event.create('monthChange', 'date'),
    handler: {
        'teamChange': function(sender, team){
            this.data.team = team;
            this.action.changeRoute(this.data);
            //console.log(this, team);
        },
        'monthChange': function(sender, date){
            var momentDate = moment(date);
            this.data.month = momentDate.format("MMMM");
            this.data.year = momentDate.format("YYYY");
            this.action.changeRoute(this.data);
        }
    }
});

