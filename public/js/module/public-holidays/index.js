basis.require('basis.ui');
basis.require('basis.entity');
basis.require('basis.net.service');
var ajax = require('basis.net.ajax');

var moment = require('../../../components/moment/moment.js');

var momentDate = moment();

var monthsSource = [];
var daysSource = [];

var daysInYear = 365;

for (var i = 0; i < 12; i++) {
    monthsSource.push({
        monthId: parseInt(momentDate.month(i).format('M'), 10),
        title: momentDate.month(i).format('MMMM')
    });
}

for (i = 0; i < daysInYear; i++) {
    daysSource.push({
        id: i,
        monthId: parseInt(momentDate.dayOfYear(i).format('M'), 10),
        title: momentDate.dayOfYear(i).format('DD'),
        isHoliday: false
    });
}

function postChanges(dates, done){
    ajax.request({
        url: '/public-holidays/update',
        method: 'POST',
        contentType: "application/json",
        postBody: JSON.stringify(dates),
        handler: {
            success: function(){
                done();
            },
            failure: function(){
            }
        }
    });
}

var Month = basis.entity.createType({
    name: 'Month',
    fields: {
        monthId: basis.entity.IntId,
        title: String
    },
    all: {
        syncAction: function(){
            this.sync(monthsSource && monthsSource.map(this.wrapper.reader));
        }
    }
});

var Day = basis.entity.createType({
    name: 'Day',
    autoDelegate: true,
    fields: {
        id: basis.entity.IntId,
        group: 'Month',
        title: String,
        isHoliday: Boolean,
        isWeekend: Boolean,
        isChecked: Boolean,
        date: String
    },
    aliases: {
        monthId: 'group'
    },
    all: {
        syncAction: function(){
            this.sync(daysSource && daysSource.map(this.wrapper.reader));
        }
    }
});



module.exports = basis.ui.Node.subclass({
    name: 'PublicHolidaysYear',
    template: '<div class="days-list"><div{childNodesElement}/><div class="clearfix"></div><!--{toggleButton}--></div>',
    dataSource: Day.all,
    binding: {
        toggleButton: new basis.ui.button.Button({
            caption: 'Toggle selected items',
            click: function () {
                var selectedDates = [];
                var self = this;

                for(var i = 0; i < this.owner.childNodes.length; i++){
                    if(this.owner.childNodes[i].name = 'Day' && this.owner.childNodes[i].data.isChecked){
                        selectedDates.push(this.owner.childNodes[i].data.date);
                    }
                }

                if(selectedDates.length){
                    postChanges(
                        selectedDates,
                        function(){
                            self.owner.parentNode.delegate.sync(
                                function(){
                                    self.owner.update({publicHolidays: self.owner.parentNode.delegate.data.publicHolidays});
                                }
                            );

                        }
                    );
                }
            }
        })
    },
    active: true,
    selection: {
        multiple: true
    },
    childClass: {
        name: 'Day',
        template:
            '<div class="day {selected} {isHoliday} {isWeekend} {isChecked}" event-click="select">' +
                '{title}' +
            '</div>',
        action: {
            select: function(event){

                this.update({isChecked: !this.delegate.data.isChecked});
                this.select(event.ctrlKey || event.metaKey);
            }
        },
        binding: {
            title: 'data:',
            isHoliday: 'data:',
            isWeekend: 'data:',
            isChecked: 'data:'
        }
    },
    sorting: 'data.id',
    grouping: {
        dataSource: Month.all,
        active: true,
        rule: 'data.group',
        //sorting: 'data.id',
        childClass: {
            template:
                '<div class="month">' +
                    '<div class="month-Title">' +
                        '{title}' +
                    '</div>' +
                '</div>',
            binding: {
                title: 'data:'
            }
        }
    },
    handler: {
        update: function(){
            var year = parseInt(this.data.year, 10);

            var momentDate = moment().date(1).month(0).year(year);

            daysSource = [];

            while(momentDate.format('YYYY') == year){
                daysSource.push({
                    id: momentDate.format('DDD'),
                    monthId: parseInt(momentDate.format('M'), 10),
                    title: momentDate.format('DD'),
                    isHoliday: this.data.publicHolidays.hasOwnProperty(momentDate.format('YYYY-MM-DD')),
                    isWeekend: [6,7].indexOf(parseInt(momentDate.format('E'), 10)) >= 0,
                    isChecked: false,
                    date: momentDate.format('YYYY-MM-DD')
                });

                momentDate.add(1, 'd');
            }

            Day.all.sync(daysSource && daysSource.map(Day.all.wrapper.reader));
        }
    }
});