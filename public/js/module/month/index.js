require('basis.ui');

var moment = require('../../../components/moment/moment.js');

var Day = require('../day/index.js');

var Month = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    binding: {
        name: function (node) {
            return node.name;
        },
        year: function (node) {
            return node.year;
        }
    }
});
module.exports = function(monthName, year, employeeDays){
    var node = new Month({name: monthName, year: year});

    var childNodes = [];

    var month = moment(year + ":" + monthName, "YYYY:MMMM");

    for(var i = 0; i < month.daysInMonth(); i++){
        var date = month.date(i + 1);
        childNodes.push(new Day({data: {
            name: i+1,
            weekend: [6, 7].indexOf(date.isoWeekday()) != -1,
            type: employeeDays.hasOwnProperty(date.format("DD.MM.YYYY"))
                ? employeeDays[date.format("DD.MM.YYYY")].day_type_id
                : ''
        }}));
    }

    node.setChildNodes(childNodes);

    return node;
};
