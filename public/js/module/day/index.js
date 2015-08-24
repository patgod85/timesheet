var ui = require('basis.ui');

module.exports = ui.Node.subclass({
    data: {
        day: null,
        title: '',
        weekend: false,
        type: '',
        checked: false,
        isShift: false
    },
    template: resource('./template/index.tmpl'),
    binding: {
        day: "data:day",
        title: 'data:title',
        weekend: 'data:weekend',
        type: 'data:type',
        isType: function(node){
            return !node.data.isShift;
        },
        isShift: 'data:isShift',
        checked: function(node){
            return node.data.checked ? 'checked_day' : '';
        },
        clickable: function(){
            return true;//node.data.title != '-';
        }
    },
    action: {
        dayClick: function(){
            /*if(this.data.title == '-'){
                return;
            }*/
            this.data.checked = !this.data.checked;
            this.updateBind('checked');
        }
    }
});
