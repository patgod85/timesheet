var ui = require('basis.ui');
var button = require('basis.ui.button');
var dom = require('basis.dom');

var profileService = require('./profileService.js');

var LoginStatus = ui.Node.subclass({
    name: 'LoginStatus',
    autoDelegate: true,
    template: resource('./template/loginStatus.tmpl'),
    binding: {
        loggedInAs: function(node){
            return node.owner ? node.owner.data.loggedInAs : "";
        },
        logoutButton: new button.Button({
            caption: 'Logout',
            click: function() {
                window.location = "/app/logout";
            }
        })
    }
});

module.exports = ui.Node.subclass({
    container: dom.get('auth'),
    template: resource('./template/index.tmpl'),
    data: {
        loggedInAs: ''
    },
    satellite: {
        loginStatus: {
            instance: LoginStatus,
            existsIf: function(owner){
                return owner.data.loggedInAs != ''
            }
        }
    },
    binding: {
        loginStatus: "satellite:loginStatus"
    },

    init: function(){
        var self = this;
        ui.Node.prototype.init.call(this);

        profileService
            .whoami(
                function (data){

                    self.update({loggedInAs: data.user.name});
                    self.authCallback(data.user);

                },
                function(){
                    window.location = "/app/login";
                }
            )
            .request();
    }
});
