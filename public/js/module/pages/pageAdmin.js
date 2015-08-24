var ui = require('basis.ui');
var button = require("basis.ui.button");

var Page = require('./page.js');
var TeamsTree = require('../admin/index.js');
var TeamForm = require('../team/form.js');
var EmployeeForm = require('../employee/form.js');
var UserForm = require('../user/form.js');


module.exports = Page.subclass({
    name: 'adminPage',
    title: 'Admin area',
    template: resource('./template/admin.tmpl'),
    satellite: {
        teamForm: {
            instance: TeamForm,
            existsIf: function(owner){
                return owner.data.adminEdit && !owner.data.adminEdit.delegate.data.hasOwnProperty('surname');
            },
            delegate: function(owner){
                return owner.delegate.data.adminEdit.delegate;
            }
        },
        employeeForm: {
            instance: EmployeeForm,
            existsIf: function(owner){
                return owner.data.adminEdit && owner.data.adminEdit.delegate.data.hasOwnProperty('surname') && !owner.data.adminEdit.delegate.data.hasOwnProperty('is_super');
            },
            delegate: function(owner){
                return owner.delegate.data.adminEdit.delegate;
            }
        },
        userForm: {
            instance: UserForm,
            existsIf: function(owner){
                return owner.data.adminEdit && owner.data.adminEdit.delegate.data.hasOwnProperty('surname') && owner.data.adminEdit.delegate.data.hasOwnProperty('is_super');
            },
            delegate: function(owner){
                return owner.delegate.data.adminEdit.delegate;
            }
        }

    },
    binding: {
        teamForm: "satellite:",
        userForm: "satellite:",
        employeeForm: "satellite:"
    },
    init: function(){
        ui.Node.prototype.init.call(this);

        var nodes = [
            TeamsTree(this.data.employeesAndUsersByTeams)
        ];

        if(this.data.user.is_super){
            nodes.push(
                new button.Button({
                    caption: 'Create new team',
                    click: function () {
                        this.parentNode.delegate.data.Team({
                            path: "/",
                            team_code: "new",
                            code: "new",
                            id: 0,
                            name: 'New team'
                        });
                    }
                })
            );
        }

        this.setChildNodes(nodes);

        var self = this;

        this.router.add('admin', {
            match: function(){
                self.select();
            }
        });

        this.router.add('admin/employee/:id', {
            match: function(id){
                self.select();

                selectItemInTree(self.getChildByName("TeamsTree"), 'employee', id);
            }
        });

        this.router.add('admin/team/:id', {
            match: function(id){
                self.select();
                selectItemInTree(self.getChildByName("TeamsTree"), 'team', id);
            }
        });

        this.router.add('admin/user/:id', {
            match: function(id){
                self.select();
                selectItemInTree(self.getChildByName("TeamsTree"), 'user', id);
            }
        });
    },
    handler: {
        select: function(node, type, id){
            if(typeof type != 'undefined' && typeof id != 'undefined') {
                this.router.navigate('admin/' + type + '/' + id);
            }
        }
    }
});

function selectItemInTree(tree, type, id){
    var treeItems = tree.childNodes;
    for(var i = 0; i < treeItems.length; i++){
        if(type == 'team') {
            if (treeItems[i].delegate.data.id == id) {
                treeItems[i].select();
                return;
            }
        }
        else {
            for (var j = 0; j < treeItems[i].childNodes.length; j++) {
                if (treeItems[i].childNodes[j].delegate.data.id == id && treeItems[i].childNodes[j].name == type) {
                    treeItems[i].childNodes[j].select();
                    return;
                }
            }
        }
    }

}
