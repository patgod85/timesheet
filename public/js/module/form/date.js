var ui = require('basis.ui');
var calendar = require('basis.ui.calendar');
var button = require("basis.ui.button");
var Popup = require('basis.ui.popup').Popup;

var Value = require("basis.data").Value;

var moment = require('../../../components/moment/moment.js');


var popup = new Popup({
    dir: 'left bottom left top',
    autorotate: true,
    hideOnKey: basis.fn.$true,
    template: resource('./template/popup-calendar.tmpl'),
    childNodes: new calendar.Calendar({
        name: "Calendar",
        childNodes: ['Month', 'Year', 'YearDecade'],
        action: {
            click: function () {
            }
        },
        handler: {
            change: function () {
                this.parentNode.caller.changeDate(this.selectedDate.value);
                popup.hide();
            }
        }
    })
});

module.exports = ui.Node.subclass({
    autoDelegate: true,
    className: 'BuBu',
    isCalendarVisible: false,
    template: resource('./template/date.tmpl'),
    satellite: {
        clear: {
            instance: button.Button.subclass({
                caption: 'Clear',
                click: function() {
                    this.owner.changeDate();
                }
            })
        },
        change:  {
            instance: button.Button.subclass({
                caption: 'Change',
                date: new Value(""),
                click: function () {
                    popup.caller = this.owner;

                    popup.getChildByName("Calendar").selectedDate.set(
                        moment(this.owner.date, "YYYY-MM-DD").toDate()
                    );

                    popup.show(this.element);
                }
            })
        }


    },
    binding: {
        clear: "satellite:",
        change: "satellite:",
        title: function(node){
            return node.title;
        }
    },
    childClass:
        new ui.Node.subclass({
            template: "<span>{date}</span>",
            autoDelegate: true,
            handler: {
                update: function(){
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    var d = this.delegate.data;

                    if(d && d[this.name] && d[this.name] != 'null') {
                        this.date = moment(d[this.name]).format('YYYY-MM-DD');
                    }else{
                        this.date = 'not specified';
                    }

                    this.updateBind('date');

                    this.parentNode.date = this.date;
                }
            },

            binding: {
                date: function(node){
                    return node.date;
                }
            }
        })


    ,
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
        ui.Node.prototype.init.call(this);

        this.setChildNodes([
            {title: this.title, name: this.name}
        ]);


    }
});


