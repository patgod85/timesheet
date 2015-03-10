require('basis.ui');
var Month = require('../month/index.js');
var Day = require('../day/index.js');

module.exports = basis.ui.Node.subclass({
    //data: {
    //    entity: null
    //},
    className: 'Employee',
    template: resource('./template/index.tmpl'),
    binding: {
        name: "data.name"
    },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        this.setChildNodes([
            new Month({
                data: {month: this.month, year: this.year, entity: this.data}
            })
        ]);
    }
});
