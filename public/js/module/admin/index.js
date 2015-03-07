basis.require('basis.dom');
basis.require('basis.data.dataset');
basis.require('basis.ui.tree');
basis.require('basis.ui.button');

module.exports = basis.ui.tree.Tree.subclass({
    container: basis.dom.get('sourceTree'),
    selection: { multiple: false },
    init: function(){
        basis.ui.Node.prototype.init.call(this);

        var children = [];

        var teams = this.delegate.data.teams;

        for(var i in  teams){

            if(teams.hasOwnProperty(i)) {

                var e = teams[i].employees;
                var es = [];
                for(var j in e){
                    if(e.hasOwnProperty(j)) {
                        es.push(e[j]);
                    }
                }

                children.push(new basis.ui.tree.Folder({
                    data: {
                        id: teams[i].code,
                        title: teams[i].name
                    },
                    handler: {
                        select: function(){
                            this.parentNode.emit_select('team', this.data.id);
                            //this.delegate.adminTeam = this;
                            //console.log(this);
                        }
                    },
                    childFactory: function (config) {
                        return new basis.ui.tree.Node({
                            data: {
                                id: config.id,
                                title: config.name + ' ' + config.surname
                            },
                            handler: {
                                select: function(){
                                    this.parentNode.parentNode.emit_select('user', this.data.id);
                                    //this.delegate.adminTeam = this;
                                    //console.log(this);
                                }
                            }
                        })
                    },
                    childNodes: es
                }));
            }
        }

        this.setChildNodes(children);
    },
    handler: {
        select: function(node, type, id){
            this.delegate.update({adminSelected: {type: type, id: id}});
            //console.log(this);
        }
    }
});