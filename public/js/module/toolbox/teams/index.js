require('basis.dom');
require('basis.ui');

module.exports = basis.ui.Node.subclass({
    autoDelegate: true,
    template: resource('./template/list.tmpl'),
    childClass: basis.ui.Node.subclass({
        template: resource('./template/item.tmpl'),
        data: {
            name: 'default',
            id: 0
        },
        binding: {
            name: 'data:name',
            id: 'data:id'
        },
        action: {
            selectTeam: function(){
                this.parentNode.owner.emit_teamChange(this.data.code);
            }
        }
    })
});
