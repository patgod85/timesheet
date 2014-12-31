require('basis.ui');
var Month = require('../month/index.js');

var Employee = basis.ui.Node.subclass({
    data: {
        entity: null
    },
    className: 'Employee',
    template: resource('./template/index.tmpl'),
    binding: {
        name: "data.entity.name"
    }
});


module.exports = function(entity, month, year){
    var node = new Employee({data: { entity: entity }});
    node.setChildNodes([new Month(month, year, entity.days, true, entity.work_start, entity.work_end)]);
    return node;
};

