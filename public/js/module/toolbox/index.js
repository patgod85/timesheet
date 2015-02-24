require('basis.ui');
require('basis.ui.button');
var router = require('basis.router');
var moment = require('../../../components/moment/moment.js');

var Teams = require('./teams/index.js');
var Calendar = require('./calendar/index.js');


module.exports = basis.ui.Node.subclass({
    autoDelegate: true,
    container: basis.dom.get('toolbox'),
    template: resource('./template/index.tmpl'),
    satellite: {
        calendar: {
            instanceOf: Calendar,
            config: function(owner){
                return {
                    date: (new Date).setFullYear(parseInt(owner.data.year))
                }
            }
        },
        teamsList: {
            instanceOf: Teams,
            config: function(owner){

                var teams = owner.data.teams;
                var arr = [];

                for(var i in teams){
                    if(teams.hasOwnProperty(i)){
                        arr.push({data: {id: teams[i].id, name: teams[i].name, code: teams[i].code}});
                    }
                }

                return {
                    childNodes: arr
                }
            }
        }
    },
    binding: {
        calendar: "satellite:calendar",
        button: new basis.ui.button.Button({
            caption: 'Public holidays',
            click: function () {
                this.owner.action.navigateToPublicHolidays(this.owner.data);
            }
        }),
        teamsList: "satellite:teamsList"
    },
    action: {
        navigateToTeam: function(data) {
            router.navigate('team/' + data.team + '/' + data.month + '/' + data.year);
        },
        navigateToPublicHolidays: function(data){
            router.navigate("public-holidays/" + data.month + '/' + data.year);
        }
    },
    emit_teamChange: basis.event.create('teamChange', 'team'),
    emit_monthChange: basis.event.create('monthChange', 'date'),
    handler: {
        'teamChange': function(sender, team){
            this.data.team = team;
            this.action.navigateToTeam(this.data);
        },
        'monthChange': function(sender, date){
            var momentDate = moment(date);
            this.data.month = momentDate.format("MMMM");
            this.data.year = momentDate.format("YYYY");
            if(location.hash.match(/public-holidays/)){
                this.action.navigateToPublicHolidays(this.data);
            }else{
                this.action.navigateToTeam(this.data);
            }
        }
    }
});

