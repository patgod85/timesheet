require('basis.ui');
require('basis.ui.button');
require('basis.dom');

var ajax = require('basis.net.ajax');
var FormInput = require('../form/text.js');
var FormCheckbox = require('../form/checkbox.js');
var FormPasswordInput = require('../form/password.js');

module.exports = basis.ui.Node.subclass({
    name: 'UserForm',
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
        if(config.type == 'checkbox'){
            return new FormCheckbox(config);
        }
        if(config.type == 'password'){
            return new FormPasswordInput(config);
        }
        return new FormInput(config);
    },
    childNodes: [
        {title: 'Email', name: 'email'},
        {title: 'Name', name: 'name'},
        {title: 'Surname', name: 'surname'},
        {title: 'Is super', name: 'is_super', type: 'checkbox'},
        {title: 'Is enabled', name: 'is_enabled', type: 'checkbox'},
        {title: 'Password (Fill this field if you want to reset password for user)', name: 'new_password', type: 'password'}
    ],
    submit: function(){
        var self = this;
        ajax.request({
            url: '/user/update',
            method: 'POST',
            contentType: "application/json",
            postBody: JSON.stringify(self.data),
            handler: {
                success: function(){
                    self.owner.delegate.sync();
                    alert("User successfully updated");
                },
                failure: function(){
                    alert("Update of user is failed");
                }
            }
        });
    }
});
