require('basis.ui');

var moment = require('../../../components/moment/moment.js');
var Day = require('../day/index.js');

module.exports = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    className: "Month",
    binding: {
        name: "data:name",
        year: "data:year",
        isActive: "data:isActive",
        workingDays: "data:workingDays"
    },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        var childNodes = [];

        var month = moment(this.data.year + ":" + this.data.month, "YYYY:MMMM");
        this.data.workingDays = 0;
        this.data.name = month.format('MMMM');

        for(var i = 0; i < month.daysInMonth(); i++){
            var date = month.date(i + 1);
            var isWeekend = [6, 7].indexOf(date.isoWeekday()) != -1;
            if(!isWeekend){
                this.data.workingDays++;
            }
            var name = i + 1;
            var hasType = typeof this.data.entity !== 'undefined' && this.data.entity.days.hasOwnProperty(date.format("DD.MM.YYYY"));

            if(typeof this.data.entity !== 'undefined' && typeof this.data.entity.work_start !== 'undefined' && moment(this.data.entity.work_start, "DD.MM.YYYY") < date && (typeof this.data.entity.work_end !== 'undefined' || typeof this.data.entity.work_end !== 'undefined' && moment(this.data.entity.work_end) > date)){
                if(isWeekend || hasType){
                    name = "";
                }else{
                    name = "1";
                }
            }

            childNodes.push(new Day({data: {
                day: i+1,
                title: name,
                weekend: isWeekend,
                type: hasType
                    ? this.data.entity.days[date.format("DD.MM.YYYY")].day_type_id
                    : ''
            }}));
        }

        this.setChildNodes(childNodes);
    }
});
