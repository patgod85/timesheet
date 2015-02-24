require('basis.ui.calendar');

module.exports = basis.ui.calendar.Calendar.subclass({
    childNodes: ['Year', 'YearDecade'],
    action: {
        click: function () {}
    },
    handler : {
        change : function () {
            this.owner.emit_monthChange(this.selectedDate.value);
        }
    }
});