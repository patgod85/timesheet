require('basis.ui');
var moment = require('../../../components/moment/moment.js');
var ajax = require('basis.net.ajax');
var router = basis.require('basis.router');

var Agenda = require('./module/agenda/index.js');
var PublicHolidays = require('./module/public-holidays/index.js');
var Toolbox = require('./module/toolbox/index.js');
var User = require('./module/user/index.js');
var Team = require('./module/team/index.js');
var Pages = require('./module/pages/index.js');

var pages;

var modelUrl = 'http://localhost:8888/model';

var model = new basis.data.Object({
    data: {
        month: 'March',
        year: 2015,
        team: '',
        teams: {},
        publicHolidays: {},
        dayTypes: {}
    }
});

new User({authCallback: onAuthenticationComplete});

function onAuthenticationComplete(){

    updateModel(function(transport, request, response){

        new Toolbox({delegate: model});

        model.update(response);

        initPages();

        initRoutes();
    });
}

function initPages(){
    pages = new Pages();

    var page1 = {
        name: 'publicHolidaysPage',
        childNodes: [
            new PublicHolidays()
        ]
    };


    var page2 = {
        name: 'teamPage',
        childNodes: [
            new Team({delegate: model}),
            new Agenda({ dayTypes: model.data.dayTypes })
        ],
        emit_applyDayType: basis.event.create('applyDayType', 'typeId'),
        handler: {
            applyDayType: function (sender, typeId) {
                applyTypeForSelectedDays(this.getChildByName('Team'), typeId);
            }
        }
    };

    pages.setChildNodes([
        page1,
        page2
    ]);
}

function initRoutes(){
    router.start();
    router.add('team/:team/:month/:year', {
        match: function(teamCode, month, year){
            model.update({
                team: teamCode,
                month: month,
                year: year + ' ' // Very strange bug. Without this space delegate does not change
            });

            var page = pages.getChildByName('teamPage');
            page.select();
        }
    });
    router.add('public-holidays/:month/:year', {
        match: function(month, year){

            model.update({
                month: month,
                year: year
            });

            var page = pages.getChildByName('publicHolidaysPage');
            page.select();
            page.getChildByName('PublicHolidaysYear').update({year: model.data.year, publicHolidays: model.data.publicHolidays});
        }
    });
}

function updateModel(done){
    ajax.request({
        url: modelUrl,
        method: 'GET',
        handler: {
            success: done
        }
    });
}

function applyTypeForSelectedDays(currentTeam, typeId){
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
                                id: employee.data.entity.id,
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
                    updateModel(function(transport, request, response){
                        model.update(response);
                    });
                }
            }
        });
    }
}

