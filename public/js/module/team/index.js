require('basis.dom');
require('basis.ui');
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
        }
    },
    binding: {
        name: 'name',
        code: 'data:team',
        month: 'satellite:'
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
                    publicHolidays: this.data.publicHolidays
                },
                config
            )
        );
    }
});
