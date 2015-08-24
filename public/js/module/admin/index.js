var ui = require('basis.ui');
var tree = require('basis.ui.tree');

module.exports = function(dataSource) {
    var grouping = {
        childClass: ui.PartitionNode,
        rule: function (node) {
            return node instanceof tree.Folder == false;
        },
        sorting: basis.getter('data.id')
    };

    var EmployeeNode = tree.Node.subclass({
        name: "employee",
        binding: {
            title: 'data:name',
            type: 'employee'
        },
        handler: {
            select: function(){
                this.parentNode.parentNode.emit_select('employee', this.delegate);
            }
        }
    });

    var UserNode = tree.Node.subclass({
        template:
            '<b:include src="basis.ui.tree.Node" class="selection-red">' +
            '</b:include>',
        name: "user",
        binding: {
            title: 'data:name',
            type: 'user'
        },
        handler: {
            select: function(){
                this.parentNode.parentNode.emit_select('user', this.delegate);
            }
        }
    });

    var TeamNode = tree.Folder.subclass({
        name: "team",
        binding: {
            title: 'data:name'
        },
        sorting: basis.getter('data.name'),
        grouping: grouping,
        init: function () {
            tree.Node.prototype.init.call(this);
            this.setDataSource(dataSource.getSubset(this.data.path + '' + this.data.team_code + '/'));
        },
        handler: {
            select: function(){
                this.parentNode.emit_select('team', this.delegate);
            }
        }
    });


    var TreeNode = tree.Tree.subclass({
        name: "TeamsTree",
        selection: {multiple: false},
        grouping: {
            childClass: ui.PartitionNode,
            rule: function (node) {
                return node instanceof tree.Folder == false;
            },
            sorting: basis.getter('data.id')
        },
        dataSource: dataSource.getSubset('/'),
        childFactory: function(config){
            if(config.delegate.data.hasOwnProperty('surname')) {
                if(config.delegate.data.hasOwnProperty('is_super')) {
                    return new UserNode(config);
                }
                else{
                    return new EmployeeNode(config);
                }
            }
            else {
                return new TeamNode(basis.object.extend({childFactory: this.childFactory}, config));
            }
        },
        init: function () {
            tree.Node.prototype.init.call(this);
        },
        handler: {
            select: function (node, type, delegate) {
                if(delegate) {
                    this.parentNode.delegate.update({adminEdit: {delegate: delegate}});
                    this.parentNode.emit_select(type, delegate.data.id);
                }
            }
        }
    });

    return new TreeNode;
};