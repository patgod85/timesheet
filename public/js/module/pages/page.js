basis.require('basis.ui');

module.exports = basis.ui.Node.subclass({
    template:
        '<div class="page page-{unselected}" id="{name}">' +
            '<h2>{name}</h2>' +
            '<div{childNodesElement}/>' +
            '<!--{teamForm}-->' +
            '<!--{employeeForm}-->' +
            '<!--{userForm}-->' +
        '</div>',
    binding: {
        name: 'title'
    }
});
