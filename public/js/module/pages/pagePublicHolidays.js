var Page = require('./page.js');
var PublicHolidays = require('../public-holidays/index.js');

module.exports = Page.subclass({
    name: 'publicHolidaysPage',
    childNodes: [
        new PublicHolidays()
    ],
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        var self = this;

        this.router.add('public-holidays/:month/:year', {
            match: function(month, year){

                self.update({
                    month: month,
                    year: year
                });

                self.select();
                self.getChildByName('PublicHolidaysYear').update({year: self.data.year, publicHolidays: self.data.publicHolidays});
            }
        });
    }
});