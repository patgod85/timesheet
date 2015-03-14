basis.require('basis.dom');
basis.require('basis.data.dataset');
basis.require('basis.ui.tree');
basis.require('basis.ui.button');


module.exports = function(dataSource) {
    var grouping = {
        childClass: basis.ui.PartitionNode,
        rule: function (node) {
            return node instanceof basis.ui.tree.Folder == false;
        },
        sorting: basis.getter('data.id')
    };

    var FileNode = basis.ui.tree.Node.subclass({
        binding: {
            title: 'data:name'
        },
        handler: {
            select: function(){
                this.parentNode.parentNode.emit_select('employee', this.delegate);
            }
        }
    });

    var FolderNode = basis.ui.tree.Folder.subclass({
        binding: {
            title: 'data:name'
        },
        sorting: basis.getter('data.name'),
        grouping: grouping,
        init: function () {
            basis.ui.tree.Node.prototype.init.call(this);
            this.setDataSource(dataSource.getSubset(this.data.path + '' + this.data.team_code + '/'));
        },
        handler: {
            select: function(){
                this.parentNode.emit_select('team', this.delegate);
            }
        }
    });


    var tree = basis.ui.tree.Tree.subclass({
        name: "TeamsTree",
        selection: {multiple: false},
        grouping: {
            childClass: basis.ui.PartitionNode,
            rule: function (node) {
                return node instanceof basis.ui.tree.Folder == false;
            },
            sorting: basis.getter('data.id')
        },
        dataSource: dataSource.getSubset('/'),
        childFactory: function(config){
            if(config.delegate.data.hasOwnProperty('surname')) {
                return new FileNode(config);
            }
            else {
                return new FolderNode(basis.object.extend({childFactory: this.childFactory}, config));
            }
        },
        init: function () {
            basis.ui.tree.Node.prototype.init.call(this);
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

    return new tree;
};