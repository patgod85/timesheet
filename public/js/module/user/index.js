require("basis.ui");
require('basis.ui.button');
require('basis.ui.field');

var profileService = require('./profileService.js');

var LoginForm = basis.ui.Node.subclass({
    data: {
        username: 'victor',
        password: 'victor1'
    },
    name: 'LoginForm',
    template: resource('./template/loginForm.tmpl'),
    satellite: {
        username: {
            instanceOf: basis.ui.field.Text.subclass({
                title: 'Login',
                action: {
                    keyup: function (event) {
                        this.owner.update({
                            username: event.sender.value
                        });
                    }
                }
            }),
            config: function (owner) {
                return {
                    value: owner.data.username
                }
            }
        },
        password: {
            instanceOf: basis.ui.field.Password.subclass({
                title: 'Password',
                action: {
                    keyup: function (event) {
                        this.owner.update({
                            password: event.sender.value
                        });
                    }
                }
            }),
            config: function (owner) {
                return {
                    value: owner.data.password
                }
            }
        }
    },
    binding: {
        button: new basis.ui.button.Button({
            caption: 'Sign in',
            click: function () {
                this.owner.action.signIn(this.owner, this.owner.data);
            }
        }),
        username: "satellite:username",
        password: "satellite:password"
    },
    action: {
        signIn: function (self, data) {
            profileService
                .signIn(function (data){
                    self.owner.authCallback(data.user);
                    self.owner.update({loggedInAs: data.user.name});
                })
                .request({
                    postBody: JSON.stringify({
                        username: data.username,
                        password: data.password
                    })
                });
        }
    }
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
            instanceOf: LoginForm,
            existsIf: function(owner){
                return owner.data.loggedInAs == ''
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
            .whoami(function (data){
                self.update({loggedInAs: data.user.name});

                self.authCallback(data.user);
            })
            .request();
    }
});
