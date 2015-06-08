require("basis.ui");
require('basis.ui.form');
require('basis.ui.button');
require('basis.ui.field');

var profileService = require('./profileService.js');

var loginForm = new basis.ui.form.FormContent({
    name: 'LoginForm',
    childNodes: [
        {
            type: 'text',
            title: 'Login',
            name: 'username',
            action: {
                keyup: function (event) {
                    this.parentNode.update({
                        username: event.sender.value
                    });
                }
            }
        },
        {
            type: 'password',
            title: 'Password',
            name: 'password',
            action: {
                keyup: function (event) {
                    this.parentNode.update({
                        password: event.sender.value
                    });
                }
            }
        }
    ],
    onSubmit: function(data){
        var self = this;
        profileService
            .signIn(function (data){
                self.parentNode.owner.authCallback(data.user);
                self.parentNode.owner.update({loggedInAs: data.user.name});
            })
            .request({
                postBody: JSON.stringify({
                    username: data.username,
                    password: data.password
                })
            });
    }
});

var LoginFormWrapper = basis.ui.Node.subclass({
    name: 'LoginFormWrapper',
    template: resource('./template/loginForm.tmpl'),
    childNodes: [
        loginForm,
        new basis.ui.button.Button({
            caption: 'Sign in',
            click: function () {
                loginForm.submit();
            }
        })
    ]
});

var LoginStatus = basis.ui.Node.subclass({
    name: 'LoginStatus',
    autoDelegate: true,
    template: resource('./template/loginStatus.tmpl'),
    binding: {
        loggedInAs: function(node){
            return node.owner.data.loggedInAs;
        },
        logoutButton: new basis.ui.button.Button({
            caption: 'Logout',
            click: function() {
                window.location = "/logout";
            }
        })
    }
});

module.exports = basis.ui.Node.subclass({
    container: basis.dom.get('auth'),
    template: resource('./template/index.tmpl'),
    data: {
        loggedInAs: ''
    },
    satellite: {
        loginForm: {
            instanceOf: LoginFormWrapper,
            existsIf: function(owner){
                return owner.data.loggedInAs == '';
            }
        },
        loginStatus: {
            instanceOf: LoginStatus,
            existsIf: function(owner){
                return owner.data.loggedInAs != ''
            }
        }
    },
    binding: {
        loginForm: "satellite:loginForm",
        loginStatus: "satellite:loginStatus"
    },

    init: function(){
        var self = this;
        basis.ui.Node.prototype.init.call(this);

        profileService
            .whoami(
                function (data){

                    self.update({loggedInAs: data.user.name});
                    self.authCallback(data.user);

                },
                function(data){

                    if(data) {
                        var loginForm = self.satellite.loginForm.getChildByName('LoginForm');

                        var usernameField = loginForm.getChildByName('username');

                        usernameField.value = data.username;
                        usernameField.updateBind('value');

                        var passwordField = loginForm.getChildByName('password');

                        passwordField.value = data.password;
                        passwordField.updateBind('value');
                    }
                }
            )
            .request();
    }
});
