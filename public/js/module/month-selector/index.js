require('basis.ui');

var Option = basis.ui.Node.subclass({
    template: resource('./template/option.tmpl'),
    binding: {
        name: function (node) {
            return node.name;
        }
    }
});

module.exports = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    childNodes: [
        new Option({name: 'January'}),
        new Option({name: 'February'})
    ]
});
