require('basis.dom');
require('basis.ui');
var router = require('basis.router');
var Month = require('../month/index.js');

var Employee = require('../employee/index.js');

module.exports = basis.ui.Node.subclass({
    name: 'Team',
    template: resource('./template/index.tmpl'),
    satellite: {
        month: {
            instanceOf: Month,
            delegate: function(owner){
                return owner.delegate;
            },
            existsIf: function(owner){
                return owner.data.month;
            }
        },
        modeSwitcher: {
            instanceOf: basis.ui.Node.subclass({
                template: '<button type="button" event-click="onClick">{title}</button>',
                binding: {
                    title: function(node){
                        return 'Switch to ' + (node.data.mode == 'days' ? 'Shifts' : 'Days');
                    }
                },
                autoDelegate: true,
                action: {
                    onClick: function(){
                        var mode = this.data.mode.trim() == 'days' ? 'shifts' : 'days';
                        router.navigate('team/' + this.data.team + '/' + this.data.month + '/' + this.data.year + '/' + mode);
                        this.updateBind('title');
                    }
                }
            })
        }
    },
    binding: {
        name: 'name',
        code: 'data:team',
        month: 'satellite:',
        modeSwitcher: 'satellite:'
    },
    handler: {
        update: function(){
            if(this.dataSource) {
                var tmp = this.dataSource;
                this.setDataSource([]);
                this.setDataSource(tmp);
            }
        }
    },
    childFactory: function(config){
        return new Employee(
            basis.object.extend(
                {
                    month: this.data.month,
                    year: this.data.year,
                    mode: this.data.mode,
                    publicHolidays: this.data.publicHolidays
                },
                config
            )
        );
    }
});
