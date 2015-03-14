require('basis.ui');
require('basis.ui.button');
require('basis.dom');


module.exports = basis.ui.Node.subclass({
    name: 'TeamForm',
    template: resource('./template/form.tmpl'),
    childClass: basis.ui.field.Text.subclass({
        autoDelegate: true,
        title: "Name",
        handler: {
            update: function(){

                //noinspection JSPotentiallyInvalidUsageOfThis
                var d = this.delegate.data;

                if(d.adminEdit) {
                    this.setValue(d.adminEdit.delegate.data.name);
                }
            }
        },
        action: {
            keyup: function(e){
                //noinspection JSPotentiallyInvalidUsageOfThis
                if(this.delegate.data.adminEdit) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    this.delegate.data.adminEdit.delegate.update({name: e.sender.value});
                }
            }
        }
    })
});
