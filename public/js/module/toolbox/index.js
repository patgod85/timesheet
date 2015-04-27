require('basis.ui');
require('basis.ui.button');
var router = require('basis.router');
var moment = require('../../../components/moment/moment.js');

var Teams = require('./teams/index.js');
var Calendar = require('./calendar/index.js');


module.exports = basis.ui.Node.subclass({
    container: basis.dom.get('toolbox'),
    template: resource('./template/index.tmpl'),
    satellite: {
        calendar: {
            delegate: function(owner){
                return owner.delegate;
            },
            instanceOf: Calendar,
            existsIf: function(owner){
                return owner.data.isCalendarShown;
            }
        },
        teamsList: {
            instanceOf: Teams,
            delegate: function(owner){
                return owner.delegate;
            }
        }
    },
    binding: {
        calendar: "satellite:calendar",
        date: function(node){
            return node.data.month + ' ' + node.data.year;
        },
        isCalendarShown: "data:",
        buttonPublicHolidays: new basis.ui.button.Button({
            caption: 'Public holidays',
            click: function () {
                this.owner.action.navigateToPublicHolidays(this.owner.data);
            }
        }),
        buttonAdmin: new basis.ui.button.Button({
            caption: 'Admin area',
            click: function () {
                this.owner.action.navigateToAdmin(this.owner.data);
            }
        }),
        teamsList: "satellite:teamsList"
    },
    action: {
        navigateToAdmin: function() {
            router.navigate('admin');
        },
        navigateToTeam: function(data) {
            router.navigate('team/' + data.team + '/' + data.month + '/' + data.year);
        },
        navigateToPublicHolidays: function(data){
            router.navigate("public-holidays/" + data.month + '/' + data.year);
        },
        showCalendar: function(){
            this.update({isCalendarShown: true});
        },
        hideCalendar: function(){
            this.update({isCalendarShown: false});
        }
    },
    emit_teamChange: basis.event.create('teamChange', 'team'),
    emit_monthChange: basis.event.create('monthChange', 'date'),
    handler: {
        teamChange: function(sender, team){
            this.data.team = team;
            this.action.navigateToTeam(this.data);
        },
        monthChange: function(sender, date){
            var momentDate = moment(date);
            this.data.month = momentDate.format("MMMM");
            this.data.year = momentDate.format("YYYY");
            if(location.hash.match(/public-holidays/)){
                this.action.navigateToPublicHolidays(this.data);
            }else{
                this.action.navigateToTeam(this.data);
            }
            this.updateBind('date');
            this.update({isCalendarShown: false});
        }
    }
});

