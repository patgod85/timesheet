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
                        id: teams[i].id,
                        title: teams[i].name
                    },
                    childFactory: function (config) {
                        return new basis.ui.tree.Node({
                            data: {
                                title: config.name + ' ' + config.surname
                            },
                            handler: {
                                select: function(){
                                    console.log(arguments);
                                }
                            }
                        })
                    },
                    childNodes: es
                }));
            }
        }

        this.setChildNodes(children);
    }
});