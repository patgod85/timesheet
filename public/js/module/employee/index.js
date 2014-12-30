require('basis.ui');
var Month = require('../month/index.js');

var Employee = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    binding: {
        name: function (node) {
            return node.name;
        }
    }
});


module.exports = function(entity, month, year){
    var node = new Employee({ name: entity.name });
    node.setChildNodes([new Month(month, year, entity.days, true, entity.work_start, entity.work_end)]);
    return node;
};

