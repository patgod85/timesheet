require('basis.ui');
require('basis.ui.button');
require('basis.dom');

var ajax = require('basis.net.ajax');
var FormInput = require('../form/text.js');
var FormDate = require('../form/date.js');

var DataSet = basis.require('basis.data').Dataset;

var MaternityLeave = require('../maternity-leave/index.js');

module.exports = basis.ui.Node.subclass({
    name: 'EmployeeForm',
    template: resource('./template/form.tmpl'),
    satellite: {
        maternityLeaves: {
            instanceOf: MaternityLeave,
            dataSource: function(owner){

                var items = owner.data.maternity_leaves.map(function(item){
                    return new basis.data.Object({
                        data: item
                    });
                });

                return new DataSet({items: items});
            }
        },
        submitButton: {
            instanceOf: basis.ui.button.Button.subclass({
                caption: 'Save',
                click: function () {
                    this.owner.submit();
                }
            })
        }
    },
    binding: {
        maternityLeaves: "satellite:",
        submitButton: "satellite:"
    },
    childFactory: function(config){
        if(config.type == 'date'){
            return new FormDate(config);
        }
        return new FormInput(config);
    },
    childNodes: [
        {title: 'Name', name: 'name'},
        {title: 'Surname', name: 'surname'},
        {title: 'Work start', name: 'work_start', type: 'date'},
        {title: 'Work end', name: 'work_end', type: 'date'}
    ],
    submit: function(){
        var self = this;
        ajax.request({
            url: '/employee/update',
            method: 'POST',
            contentType: "application/json",
            postBody: JSON.stringify(self.data),
            handler: {
                success: function(){
                    self.owner.delegate.sync();
                    alert("Employee successfully updated");
                },
                failure: function(){
                    alert("Update of employee is failed");
                }
            }
        });
    }
});
