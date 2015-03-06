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

        var tree;

        this.setChildNodes([
            tree = new TeamsTree({delegate: this.delegate}),
            new basis.ui.field.Text({
                value: tree.selection
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
