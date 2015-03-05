require('basis.dom');
require('basis.ui');

module.exports = basis.ui.Node.subclass({
    template: resource('./template/list.tmpl'),
    childClass: basis.ui.Node.subclass({
        template: resource('./template/item.tmpl'),
        data: {
            name: 'default',
            id: 0
        },
        binding: {
            name: 'data:name',
            id: 'data:id'
        },
        action: {
            selectTeam: function(){
                this.parentNode.owner.emit_teamChange(this.data.code);
            }
        }
    }),
    handler: {
        update: function(){
            var teams = this.data.teams;
            var arr = [];

            for(var i in teams){
                if(teams.hasOwnProperty(i)){
                    arr.push({data: {id: teams[i].id, name: teams[i].name, code: teams[i].code}});
                }
            }
console.log(arr);
            this.setChildNodes(arr);
        }
    }
});
