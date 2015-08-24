var ui = require("basis.ui");
var field = require("basis.ui.field");
var button = require("basis.ui.button");
var data = require("basis.data");

module.exports = ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    satellite: {
        addButton: {
            instance: button.Button.subclass({
                caption: 'Add',
                click: function () {
                    var newLeave = {id: 0, employee_id: this.owner.owner.data.id};
                    this.owner.owner.data.compensatory_leaves.push(newLeave);
                    this.owner.owner.update({compensatory_leaves: this.owner.owner.data.compensatory_leaves});

                    this.owner.dataSource.setAndDestroyRemoved(this.owner.owner.data.compensatory_leaves.map(function(item){
                        return new data.Object({
                            data: item
                        });
                    }));
                }
            })
        }
    },
    binding: {
        addButton: "satellite:"
    },
    childClass: ui.Node.subclass({
        template: resource('./template/row.tmpl'),
        binding: {
            id: "data.id"
        },
        init: function(){
            ui.Node.prototype.init.call(this);

            this.setChildNodes([
                {value: this.data.date, name: 'date'},
                {value: this.data.description, name: 'description'},
                {value: this.data.value, name: 'value'}
            ])
        },
        childFactory: function(config) {
            var self = this;
            config.action = {
                keyup: function(e){
                    var updateObj = {};
                    updateObj[config.name] = e.sender.value;
                    self.update(updateObj);
                }
            };

            return new ui.Node({
                template: '<td class="input-container"></td>',
                childNodes: [
                    new field.Text(config)
                ]
            })
        }
    })
});
