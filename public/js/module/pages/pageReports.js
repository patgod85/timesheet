var ui = require("basis.ui");

var Page = require('./page.js');
var Statistic = require('../reports/statistic.js');

module.exports = Page.subclass({
    name: 'reportsPage',
    title: 'Reports',
    init: function(){
        ui.Node.prototype.init.call(this);

        this.setChildNodes([
            new Statistic({delegate: this.delegate})
        ]);

        var self = this;

        this.router.add('reports', {
            match: function(){
                self.select();
            }
        });
    }
});

