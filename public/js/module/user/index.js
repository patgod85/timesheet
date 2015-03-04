require("basis.ui");
require('basis.ui.button');
require('basis.ui.field');

var profileService = require('./profileService.js');

module.exports = basis.ui.Node.subclass({
    autoDelegate: true,
    container: basis.dom.get('auth'),
    template: resource('./template/index.tmpl'),
    data: {
        loginDisplay: 'block',
        username: 'victor',
        password: 'victor1',
        loggedInAs: ''
    },
    satellite: {
        username: {
            instanceOf: basis.ui.field.Text.subclass({
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
        loginDisplay: "data:",
        loggedInAs: "data:",
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
                    self.update({loginDisplay: 'none', loggedInAs: data.user.name});
                    self.authCallback();
                })
                .request({
                    postBody: JSON.stringify({
                        username: data.username,
                        password: data.password
                    })
                });
        }
    },
    init: function(){
        var self = this;
        basis.ui.Node.prototype.init.call(this);
        profileService
            .whoami(function (data){
                self.update({loginDisplay: 'none', loggedInAs: data.user.name});

                self.authCallback();
            })
            .request();
    },
    handler: {
        update: function(){

        }
    }
});
