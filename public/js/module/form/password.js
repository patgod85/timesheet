var field = require('basis.ui.field');

module.exports = field.Password.subclass({
    autoDelegate: true,
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

