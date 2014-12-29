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


module.exports = function(name, month, year){
    var node = new Employee({ name: name });
    node.setChildNodes([new Month(month, year)]);
    return node;
};

