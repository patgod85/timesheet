require('basis.ui');

var Day = require('../day/index.js');

var Month = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    binding: {
        name: function (node) {
            return node.name;
        }
    }
});
module.exports = function(name){
    var node = new Month({name: name});

    node.setChildNodes([
        new Day({name: '1'}),
        new Day({name: '2'}),
        new Day({name: '3'})
    ]);

    return node;
};
