require('basis.ui');

module.exports = basis.ui.Node.subclass({
    data: {
        day: null,
        title: '',
        weekend: false,
        type: '',
        checked: false
    },
    template: resource('./template/index.tmpl'),
    binding: {
        day: "data:day",
        title: 'data:title',
        weekend: 'data:weekend',
        type: 'data:type',
        checked: function(node){
            return node.data.checked ? 'checked_day' : '';
        }
    },
    action: {
        dayClick: function(){
            this.data.checked = !this.data.checked;
            this.updateBind('checked');
        }
    }
});
