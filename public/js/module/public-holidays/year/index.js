require("basis.ui");
basis.require('basis.ui.calendar');
var ajax = require('basis.net.ajax');
var moment = require('../../../../components/moment/moment.js');

function getPublicHolidays(node) {
    ajax.request({
        url: 'http://localhost:8888/public-holidays',
        handler: {
            success: function (transport, request, response) {
                for (var i = 0; i < node.childNodes.length; i++) {

                    if (node.childNodes[i].constructor.className == "basis.ui.calendar.CalendarSection.Month") {
                        var month = node.childNodes[i];
                        for (var j = 0; j < month.childNodes.length; j++) {
                            var date = moment(month.childNodes[j].periodStart);

                            if (response.hasOwnProperty(date.format("YYYY-MM-DD"))) {
                                var day = month.childNodes[j];
                                console.log(day);
                                //day.element.title = 'holiday';
                                day.element.className += ' holiday';
                            }
                        }
                    }
                }
            },
            failure: function (transport, request, error) {
                console.log('response error:', error);
            }
        }
    });
}

module.exports = function (month, year) {

    var date = moment().month(month).year(year);
    var node = new basis.ui.calendar.Calendar({
        container: document.getElementById('placeHolder'),
        childNodes: ['Month', 'Year', 'YearDecade'],
        date: date.toDate(),
        minDate: new Date(date.date(1).toJSON()),
        maxDate: new Date(date.endOf('month').toJSON()),
        action: {
            click: function () {
            }
        },
        handler: {
            change: function () {
                //console.log(this.selectedDate.value);
                getPublicHolidays(this);
            },
            periodChanged: function () {
                console.log('Period changed');
            }
        }
    });

    getPublicHolidays(node);

    return node;
};