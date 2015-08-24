var ui = require('basis.ui');

var moment = require('../../../components/moment/moment.js');
var Day = require('../day/index.js');

module.exports = ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    className: "Month",
    binding: {
        name: "data:name",
        year: "data:year",
        isActive: "data:isActive",
        workingDays: "data:workingDays"
    },
    init: function(){
        ui.Node.prototype.init.call(this);

        this.handler.callbacks.update.call(this);
    },
    handler: {
        update: function(){

            var childNodes = [],
                month = moment().year(this.data.year).month(this.data.month);

            this.data.workingDays = 0;
            this.data.name = month.format('MMMM');

            var isEntity = typeof this.data.entity !== 'undefined';

            for(var i = 0; i < month.daysInMonth(); i++){

                var date = month.date(i + 1),
                    isWeekend = [6, 7].indexOf(date.isoWeekday()) != -1,
                    dateInString = date.format("YYYY-MM-DD"),
                    isPublicHoliday = this.data.publicHolidays.hasOwnProperty(dateInString);

                if(!isWeekend && !isPublicHoliday){
                    this.data.workingDays++;
                }

                if(this.data.mode == 'shifts' && isEntity){

                    if(this.data.entity.shifts[dateInString]){
                        childNodes.push(new Day({data: {
                            day: i+1,
                            title: '',
                            weekend: false,
                            type: this.data.entity.shifts[dateInString],
                            isShift: true
                        }}));
                    }
                }
                else {
                    childNodes.push(new Day({data: {
                        day: i+1,
                        title: !isEntity ? i + 1 : getName(dateInString, this.data.entity.days, isWeekend, isPublicHoliday),
                        weekend: isWeekend,
                        type: !isEntity ? '' : getType(dateInString, this.data.entity.days, isPublicHoliday)
                    }}));
                }
            }

            this.setChildNodes(childNodes);

            this.updateBind('name');
            this.updateBind('workingDays');
        }
    }
});


function getType(dateInString, daysWithType, isPublicHoliday){

    if(daysWithType.hasOwnProperty(dateInString)){
        var type = daysWithType[dateInString];
    }
    else if(isPublicHoliday){
        type = 3;
    }
    else{
        type = '';
    }

    return type;
}

function getName(dateInString, daysWithType, isWeekend, isPublicHoliday){
    if(daysWithType.hasOwnProperty(dateInString) || isWeekend || isPublicHoliday){
        var name = "";
    }
    else{
        name = '-';
    }

    return name;
}