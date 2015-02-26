basis.require('basis.ui');
basis.require('basis.entity');
basis.require('basis.net.service');

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
        isWeekend: Boolean
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
    container: document.getElementById('placeHolder'),
    template: '<div class="days-list"><div{childNodesElement}/><div class="clearfix"></div></div>',
    dataSource: Day.all,
    active: true,
    selection: {
        multiple: true
    },
    childClass: {
        template:
            '<div class="day {selected} {isHoliday} {isWeekend}" event-click="select">' +
                '{title}' +
            '</div>',
        action: {
            select: function(event){
                this.select(event.ctrlKey || event.metaKey);
            }
        },
        binding: {
            title: 'data:',
            isHoliday: 'data:',
            isWeekend: 'data:'
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
                    '<div class="month-Title" event-click="selectAll" title="Click to select all users in group">' +
                        '{title}' +
                    '</div>' +
                '</div>',
            action: {
                selectAll: function(){
                    this.parentNode.owner.selection.set(this.nodes);
                }
            },
            binding: {
                title: 'data:'
            }
        }
    },
    handler: {
        update: function(){
            var momentDate = moment().date(1).month(0).year(this.data.year);

            daysSource = [];

            while(momentDate.format('YYYY') == this.data.year){
                daysSource.push({
                    id: momentDate.format('DDD'),
                    monthId: parseInt(momentDate.format('M'), 10),
                    title: momentDate.format('DD'),
                    isHoliday: this.data.publicHolidays.hasOwnProperty(momentDate.format('YYYY-MM-DD')),
                    isWeekend: [6,7].indexOf(parseInt(momentDate.format('E'), 10)) >= 0
                });

                momentDate.add(1, 'd');
            }

            Day.all.sync(daysSource && daysSource.map(Day.all.wrapper.reader));
        }
    }
});