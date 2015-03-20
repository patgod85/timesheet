require('basis.ui');
var moment = require('../../../components/moment/moment.js');

module.exports = basis.ui.Node.subclass({
    autoDelegate: true,
    className: 'BuBu',
    isCalendarVisible: false,
    template: resource('./template/date.tmpl'),
    satellite: {
        calendar: {
            instanceOf: basis.ui.calendar.Calendar.subclass({
                childNodes: ['Month', 'Year', 'YearDecade'],
                action: {
                    click: function () {}
                },
                handler: {
                    change: function(){
                        this.owner.changeDate(this.selectedDate.value);
                    }
                }
            }),
            existsIf: function(owner){
                return owner.isCalendarVisible;
            },
            events: ['select', 'update']
        },
        clear: {
            instanceOf: basis.ui.button.Button.subclass({
                caption: 'Clear',
                click: function() {
                    this.owner.changeDate();
                }
            })
        }
    },
    binding: {
        calendar: "satellite:",
        clear: "satellite:"
    },
    childClass: basis.ui.field.Text.subclass({
        readOnly: true,
        autoDelegate: true,
        handler: {
            update: function(){
                //noinspection JSPotentiallyInvalidUsageOfThis
                var d = this.delegate.data;
                if(d && d[this.name]) {
                    this.setValue(moment(d[this.name]).format('YYYY-MM-DD'));
                }else{
                    this.setValue('');
                }
            }
        },
        action: {
            focus: function(){
                this.parentNode.isCalendarVisible = true;
                this.parentNode.select();
            }
        }

    }),
    handler: {
        select: function () {

            this.unselect();
        }
    },
    changeDate: function(newDate){

        this.isCalendarVisible = false;

        var field = {};
        field[this.name] = newDate ? moment(newDate).format('YYYY-MM-DD') : null;

        //noinspection JSPotentiallyInvalidUsageOfThis
        this.delegate.update(field);
    },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        this.setChildNodes([
            {title: this.title, name: this.name}
        ]);
    }
});


