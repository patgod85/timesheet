require("basis.ui");
require('basis.ui.button');
require('basis.ui.field');
var ajax = require('basis.net.ajax');

//var DataObject = basis.require('basis.data').Object;
//var Service = basis.require('basis.net.service').Service;
//var cookies = basis.require('basis.ua').cookies;
//
//var service = new Service({
//    isSecure: true
//});
//
//if (cookies.get('connect.sid')) {
//    service.openSession(cookies.get('connect.sid'));
//}


module.exports = function() {

    function userAuthenticated(data){
        node.update({loginDisplay: 'none', loggedInAs: data.user.name});

        //// предположим, сервер отдал JSON
        //// { "status": "ok", "session": "..." }
        //service.openSession(data.session);
        //
        //// сохраняем ключ сессии в cookie
        //cookies.set('sessionKey', data.session);
    }

    var node = new basis.ui.Node({
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

                profile.signIn.request({postBody: JSON.stringify({
                    username: data.username,
                    password: data.password
                })});
            }
        }
    });



    var profile = {
        whoami: new ajax.Transport({
            url: 'http://localhost:8888/whoami',
            method: 'GET',
            handler: {
                success: function (transport, request, response) {
//console.log(transport, request);
                    if (response.success) {
                        userAuthenticated(response)
                    }
                }
            }
        }),
        signIn: new ajax.Transport({
            url: 'http://localhost:8888/login',
            method: 'POST',
            contentType: "application/json",
            handler: {
                success: function (transport, request, response) {

                    if (response.success) {
                        userAuthenticated(response)

                    } else {
                        alert("Authentication failed");
                    }
                },
                failure: function () {
                    alert("Authentication failed");
                }
            }
        })
    };

    profile.whoami.request();

    return node;
};