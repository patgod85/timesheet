require('basis.ui');
require('basis.ui.button');
require('basis.dom');
require('basis.ui.form');

var ajax = require('basis.net.ajax');
var FormInput = require('../form/text.js');

module.exports = basis.ui.form.Form.subclass({
    name: 'TeamForm',
    template: resource('./template/form.tmpl'),
    satellite: {
        submitButton: {
            instanceOf: basis.ui.button.Button.subclass({
                caption: 'Save',
                click: function () {
                    this.owner.submit();
                }
            })
        },
        addButton: {
            instanceOf: basis.ui.button.Button.subclass({
                caption: 'Add new employee',
                click: function () {
                    var d = this.owner.data;
                    var newVar = {
                        path: d.path + d.code + '/',
                        team_code: d.code,
                        id: 0,
                        name: "New employee",
                        surname: "New employee",
                        work_start: new Date(),
                        work_end: null,
                        days: {},
                        team_id: d.id
                    };
                    this.owner.owner.delegate.data.Employee(newVar);
                }
            })
        }
    },
    binding: {
        submitButton: "satellite:",
        addButton: "satellite:"
    },
    childFactory: function(config){
        return new FormInput(config);
    },
    childNodes: [
        {type: "text", title: 'Name', name: 'name'},
        {type: "text", title: 'Code', name: 'code'}
    ],
    onSubmit: function(){
        var self = this;
        ajax.request({
            url: '/team/update',
            method: 'POST',
            contentType: "application/json",
            postBody: JSON.stringify(self.data),
            handler: {
                success: function(){
                    self.owner.delegate.sync();
                    alert("Team successfully updated");
                },
                failure: function(){
                    alert("Update of team is failed");
                }
            }
        });
    }
});
