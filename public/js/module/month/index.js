require('basis.ui');

var moment = require('../../../components/moment/moment.js');

var Day = require('../day/index.js');

var Month = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    binding: {
        name: "name",
        year: "year",
        isActive: "isActive",
        workingDays: "workingDays"
    }
});
module.exports = function(monthName, year, employeeDays, isActive, work_start, work_end){

    var childNodes = [];

    var month = moment(year + ":" + monthName, "YYYY:MMMM");
    var workingDays = 0;

    for(var i = 0; i < month.daysInMonth(); i++){
        var date = month.date(i + 1);
        var isWeekend = [6, 7].indexOf(date.isoWeekday()) != -1;
        if(!isWeekend){
            workingDays++;
        }
        var name = i + 1;
        var hasType = employeeDays.hasOwnProperty(date.format("DD.MM.YYYY"));

        if(typeof work_start !== 'undefined' && moment(work_start, "DD.MM.YYYY") < date && (typeof work_end !== 'undefined' || typeof work_end !== 'undefined' && moment(work_end) > date)){
            if(isWeekend || hasType){
                name = "";
            }else{
                name = "1";
            }
        }

        childNodes.push(new Day({data: {
            name: name,
            weekend: isWeekend,
            type: hasType
                ? employeeDays[date.format("DD.MM.YYYY")].day_type_id
                : ''
        }}));
    }

    var node = new Month({name: monthName, year: year, isActive: isActive? "employee_month": "header_month", workingDays: workingDays});

    node.setChildNodes(childNodes);

    return node;
};
