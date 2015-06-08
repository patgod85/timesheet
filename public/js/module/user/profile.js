require('basis.ui');
require('basis.ui.form');
require('basis.ui.button');
require('basis.dom');

var ajax = require('basis.net.ajax');
var FormInput = require('../form/text.js');
var FormPasswordInput = require('../form/password.js');

module.exports = basis.ui.form.FormContent.subclass({
    name: 'ProfileForm',
    template: resource('./template/profile.tmpl'),
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

        if(this.data.hasOwnProperty(config.name)){
            config.value = this.data[config.name];
        }

        if(config.type == 'password'){
            return new FormPasswordInput(config);
        }

        if(config.type == 'label'){
            return new basis.ui.field.Label(config);
        }

        return new FormInput(config);
    },
    childNodes: [
        {title: 'email', name: 'email', type: 'label'},
        {title: 'Name', name: 'name'},
        {title: 'Surname', name: 'surname'},
        {title: 'Old password (leave next three fields blank if you do not want to change the password)', name: 'old_password', type: 'password'},
        {title: 'New password', name: 'new_password', type: 'password'},
        {title: 'Repeat new password', name: 'new_password2', type: 'password'}
    ],
    onSubmit: function(data){

        if(data.new_password != data.new_password2){
            alert('Password repeated incorrectly');
            return;
        }

        ajax.request({
            url: '/profile/update',
            method: 'POST',
            contentType: "application/json",
            postBody: JSON.stringify(data),
            handler: {
                success: function(){
                    alert("Profile successfully updated");

                    if(data.new_password){
                        alert("Password was changed. You have to relogin");
                        document.location = '/logout';
                    }
                },
                failure: function(){
                    alert("Update of profile is failed");
                }
            }
        });
    }
});

