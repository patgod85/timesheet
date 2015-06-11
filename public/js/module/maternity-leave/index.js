
module.exports = basis.ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    satellite: {
        addButton: {
            instanceOf: basis.ui.button.Button.subclass({
                caption: 'Add',
                click: function () {
                    var newLeave = {id: 0, employee_id: this.owner.owner.data.id};
                    this.owner.owner.data.maternity_leaves.push(newLeave);
                    this.owner.owner.update({maternity_leaves: this.owner.owner.data.maternity_leaves});

                    this.owner.dataSource.sync(this.owner.owner.data.maternity_leaves.map(function(item){
                        return new basis.data.Object({
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
    childClass:  basis.ui.Node.subclass({
        template: resource('./template/row.tmpl'),
        binding: {
            id: "data.id"
        },
        init: function(){
            basis.ui.Node.prototype.init.call(this);

            this.setChildNodes([
                {value: this.data.date_start, name: 'date_start'},
                {value: this.data.date_end, name: 'date_end'}
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

            return new basis.ui.Node({
                template: '<td class="input-container"></td>',
                childNodes: [
                    new basis.ui.field.Text(config)
                ]
            })
        }
    })
});