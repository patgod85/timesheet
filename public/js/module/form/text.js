var ui = require('basis.ui');
var field = require('basis.ui.field');

module.exports = field.Text.subclass({
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
        keyup: function(e){
            //noinspection JSPotentiallyInvalidUsageOfThis
            if(this.delegate) {
                var field = {};
                field[this.name] = e.sender.value;
                //noinspection JSPotentiallyInvalidUsageOfThis
                this.delegate.update(field);
            }
        }
    }
});

