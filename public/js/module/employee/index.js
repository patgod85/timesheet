var ui = require('basis.ui');
var Month = require('../month/index.js');

module.exports = ui.Node.subclass({
    className: 'Employee',
    template: resource('./template/index.tmpl'),
    binding: {
        name: "data.name",
        surname: "data.surname"
    },
    init: function(){
        ui.Node.prototype.init.call(this);

        this.setChildNodes([
            new Month({
                data: {month: this.month, year: this.year, mode: this.mode, publicHolidays: this.publicHolidays, entity: this.data}
            })
        ]);
    }
});
