var ui = require('basis.ui');
var field = require('basis.ui.field');

module.exports = field.Checkbox.subclass({
    autoDelegate: true,
    handler: {
        update: function(){
            //noinspection JSPotentiallyInvalidUsageOfThis
            var d = this.delegate.data;
            if(d) {
                this.setValue(d[this.name]);
            }
        }
    },
    action: {
        change: function(e){

            //noinspection JSPotentiallyInvalidUsageOfThis
            if(this.delegate) {
                var field = {};
                field[this.name] = e.sender.checked;

                //noinspection JSPotentiallyInvalidUsageOfThis
                this.update(field);
            }
        }
    }
});

