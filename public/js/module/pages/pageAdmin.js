basis.require('basis.ui');

var ajax = require('basis.net.ajax');

var Page = require('./page.js');
var TeamsTree = require('../admin/index.js');

module.exports = Page.subclass({
    name: 'adminPage',
    handler: {
    },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        this.setChildNodes([
            TeamsTree(this.delegate.data.employeesByTeams),
            new basis.ui.field.Text({
                delegate: this.delegate,
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
        ]);

        var self = this;

        this.router.add('admin', {
            match: function(){
                self.select();
            }
        });
    }
});
