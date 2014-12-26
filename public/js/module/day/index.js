require('basis.ui');

module.exports = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    binding: {
        name: function(node){
            return node.name;
        }
    }
});
