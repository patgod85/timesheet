var calendar = require('basis.ui.calendar');
var moment = require('../../../../components/moment/moment.js');

module.exports = calendar.Calendar.subclass({
    childNodes: ['Year', 'YearDecade'],
    action: {
        click: function () {}
    },
    handler : {
        change : function () {
            this.owner.emit_monthChange(this.selectedDate.value);
        },
        update: function(){
            var date = moment()
                .year(parseInt(this.data.year))
                .month(this.data.month);

            this.selectedDate.set(date.toDate());
        }
    },
    init: function(){
        calendar.Calendar.prototype.init.call(this);

        var date = moment()
            .year(parseInt(this.data.year))
            .month(this.data.month);

        this.selectedDate.set(date.toDate());

    }
});