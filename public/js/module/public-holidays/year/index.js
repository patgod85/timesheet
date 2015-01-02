require("basis.ui");
basis.require('basis.ui.calendar');

module.exports = function(year){
    return new basis.ui.calendar.Calendar({
        container: document.getElementById('placeHolder'),
        childNodes: ['Month', 'Year', 'YearDecade'],
        date: (new Date()).setFullYear(year)
        ,
        action: {
            click: function () {
            }
        },
        handler: {
            change: function () {
                console.log(this.selectedDate.value);
            }
        }
    });
};