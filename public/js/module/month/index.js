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
                    isWeekend = [6, 7].indexOf(date.isoWeekday()) != -1;

                if(!isWeekend){
                    this.data.workingDays++;
                }

                childNodes.push(new Day({data: {
                    day: i+1,
                    title: !isEntity ? i + 1 : getName(date.format("YYYY-MM-DD"), this.data.entity.days, isWeekend),
                    weekend: isWeekend,
                    type: !isEntity ? '' : getType(date.format("YYYY-MM-DD"), this.data.entity.days, this.data.publicHolidays)
                }}));
            }

            this.setChildNodes(childNodes);

            this.updateBind('name');
        }
    }
});


function getType(dateInString, daysWithType, publicHolidays){

    var isPublicHoliday = publicHolidays.hasOwnProperty(dateInString);

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

function getName(dateInString, daysWithType, isWeekend){
    if(daysWithType.hasOwnProperty(dateInString) || isWeekend){
        var name = "";
    }
    else{
        name = '-';
    }

    return name;
}