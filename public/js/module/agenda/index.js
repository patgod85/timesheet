require('basis.ui');

module.exports = function (applyTypeCallback, types) {

    var node = new basis.ui.Node({
        //container: document.getElementById('placeHolder'),
        template: resource('./template/index.tmpl'),
        childClass: {
            template: resource('./template/item.tmpl'),
            binding: {
                id: 'id',
                name: 'name'
            },
            action: {
                applyType: function () {
                    applyTypeCallback(this.id);
                }
            }
        }
    });


    if(types){
        var arr = [];
        for (var i in types) {
            if (types.hasOwnProperty(i)) {
                arr.push({
                    id: types[i].id,
                    name: types[i].name
                });
            }
        }
        node.setChildNodes(arr);
    }

    return node;
};
