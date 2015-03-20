require('basis.ui');
require('basis.ui.button');
require('basis.dom');

var ajax = require('basis.net.ajax');
var FormInput = require('../form/text.js');
var FormDate = require('../form/date.js');

module.exports = basis.ui.Node.subclass({
    name: 'EmployeeForm',
    template: resource('./template/form.tmpl'),
    satellite: {
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
            url: 'http://localhost:8888/employee/update',
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
