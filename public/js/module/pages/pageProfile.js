basis.require('basis.ui');

var ajax = require('basis.net.ajax');

var Page = require('./page.js');
var ProfileForm = require('../user/profile.js');


module.exports = Page.subclass({
    name: 'profilePage',
    title: 'Profile',
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        var self = this;

        self.setChildNodes([
            new ProfileForm({data: self.data.user})
        ]);

        this.router.add('profile', {
            match: function(){
                self.select();
            }
        });

    }
});
