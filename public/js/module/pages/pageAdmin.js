basis.require('basis.ui');

var ajax = require('basis.net.ajax');

var Page = require('./page.js');
var TeamsTree = require('../admin/index.js');
var TeamForm = require('../team/form.js');
var EmployeeForm = require('../employee/form.js');


module.exports = Page.subclass({
    name: 'adminPage',
    satellite: {
        teamForm: {
            instanceOf: TeamForm,
            existsIf: function(owner){
                return owner.data.adminEdit && !owner.data.adminEdit.delegate.data.hasOwnProperty('surname');
            },
            delegate: function(owner){
                return owner.delegate.data.adminEdit.delegate;
            }
        },
        employeeForm: {
            instanceOf: EmployeeForm,
            existsIf: function(owner){
                return owner.data.adminEdit && owner.data.adminEdit.delegate.data.hasOwnProperty('surname');
            },
            delegate: function(owner){
                return owner.delegate.data.adminEdit.delegate;
            }
        }

    },
    binding: {
        teamForm: "satellite:",
        employeeForm: "satellite:"
    },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        this.setChildNodes([
            TeamsTree(this.delegate.data.employeesByTeams),
            new basis.ui.button.Button({
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
        ]);

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
                if (treeItems[i].childNodes[j].delegate.data.id == id) {
                    treeItems[i].childNodes[j].select();
                    return;
                }
            }
        }
    }

}
