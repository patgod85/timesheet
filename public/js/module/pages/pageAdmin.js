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
                handler: {
                    update: function(){
                        //noinspection JSPotentiallyInvalidUsageOfThis
                        //var d = this.delegate.data;
                        //
                        //if(d.adminSelected.type == 'team'){
                        //    this.setValue(d.teams[d.adminSelected.id].name);
                        //}
                        //else{
                        //    for(var i in d.teams){
                        //        if(d.teams.hasOwnProperty(i) && d.teams[i].employees.hasOwnProperty(d.adminSelected.id)){
                        //            this.setValue(
                        //                d.teams[i].employees[d.adminSelected.id].name
                        //                + ' '
                        //                + d.teams[i].employees[d.adminSelected.id].surname
                        //            );
                        //        }
                        //    }
                        //}
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
