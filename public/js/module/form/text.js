require('basis.ui');

module.exports = basis.ui.field.Text.subclass({
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

