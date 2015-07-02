require("basis.ui");
require('basis.ui.button');

var profileService = require('./profileService.js');

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
        loginStatus: {
            instanceOf: LoginStatus,
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
        basis.ui.Node.prototype.init.call(this);

        profileService
            .whoami(
                function (data){

                    self.update({loggedInAs: data.user.name});
                    self.authCallback(data.user);

                },
                function(){
                    window.location = "/login";
                }
            )
            .request();
    }
});
