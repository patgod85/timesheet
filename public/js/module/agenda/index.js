require('basis.ui');

module.exports = basis.ui.Node.subclass({
    name: 'Agenda',
    template: resource('./template/index.tmpl'),
    childClass: {
        template: resource('./template/item.tmpl'),
        binding: {
            id: 'data:',
            name: 'data:'
        },
        action: {
            applyType: function () {
                this.parentNode.parentNode.emit_applyDayType(this.data.id);
            }
        }
    },
    init: function(){
        var self = this;

        basis.ui.Node.prototype.init.call(this);

        var arr = Object.keys(self.dayTypes).map(function (key) {return {data: self.dayTypes[key]}});

        self.setChildNodes(
            arr
        );
    }
});
