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
            var childNodes = [];

            var month = moment().year(this.data.year).month(this.data.month);
            this.data.workingDays = 0;
            this.data.name = month.format('MMMM');

            var isEntity = typeof this.data.entity !== 'undefined',
                isEndSet = isEntity && typeof this.data.entity.work_end !== 'undefined' && this.data.entity.work_end !== 'null';

            for(var i = 0; i < month.daysInMonth(); i++){
                var date = month.date(i + 1);
                var isWeekend = [6, 7].indexOf(date.isoWeekday()) != -1;
                if(!isWeekend){
                    this.data.workingDays++;
                }
                var name = i + 1;
                var hasType = isEntity && this.data.entity.days.hasOwnProperty(date.format("YYYY-MM-DD"));

                if(isEntity){

//console.log(date.format(), this.data.entity.work_start, this.data.entity.work_end, date.isSame(this.data.entity.work_end, 'day'));
                    if( isEndSet && (date.isBetween(this.data.entity.work_start, this.data.entity.work_end) || date.isSame(this.data.entity.work_end, 'day')) || !isEndSet && date.isAfter(this.data.entity.work_start)){
                        if(isWeekend || hasType){
                            name = "";
                        }else{
                            name = "1";
                        }
                    }
                    else{
                        name = '-';
                    }
                }

                var isPublicHoliday = this.data.publicHolidays.hasOwnProperty(date.format("YYYY-MM-DD"));

                if(hasType){
                    var type = this.data.entity.days[date.format("YYYY-MM-DD")].day_type_id;
                }
                else if(isPublicHoliday){
                    type = 3;
                }
                else{
                    type = '';
                }

                childNodes.push(new Day({data: {
                    day: i+1,
                    title: name,
                    weekend: isWeekend,
                    type: type
                }}));
            }

            this.setChildNodes(childNodes);

            this.updateBind('name');
        }
    }
});
