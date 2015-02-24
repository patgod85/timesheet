require("basis.ui");
basis.require('basis.ui.calendar');
var moment = require('../../../../components/moment/moment.js');
var publicHolidays = undefined;

function updateMonthWithPublicHolidays(monthNode, publicHolidays){
    for (var j = 0; j < monthNode.childNodes.length; j++) {
        var date = moment(monthNode.childNodes[j].periodStart);

        if (publicHolidays.hasOwnProperty(date.format("YYYY-MM-DD"))) {
            var day = monthNode.childNodes[j];
            //console.log(day);
            //day.element.title = 'holiday';
            day.element.className += ' holiday';
        }
    }
}

function bindHolidaysUpdateToPeriodChange(node){
    var monthNode;

    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].constructor.className == "basis.ui.calendar.CalendarSection.Month") {
            monthNode = node.childNodes[i];
            break;
        }
    }

    if(monthNode) {
        monthNode.addHandler(
            {
                periodChanged: function () {
                    updateMonthWithPublicHolidays(monthNode, publicHolidays);
                }
            },
            node
        );

        updateMonthWithPublicHolidays(monthNode, publicHolidays);
    }
}

module.exports = function (month, year, _publicHolidays) {

    publicHolidays = _publicHolidays;

    var date = moment().month(month).year(year);

    var node = new basis.ui.calendar.Calendar({
        container: document.getElementById('placeHolder'),
        childNodes: ['Month', 'Year', 'YearDecade'],
        date: date.toDate(),
        //minDate: new Date(date.date(1).toJSON()),
        //maxDate: new Date(date.endOf('month').toJSON()),
        //isPrevPeriodEnabled: true,
        action: {
            click: function () {
            }
        }
    });

    bindHolidaysUpdateToPeriodChange(node);

    return node;
};