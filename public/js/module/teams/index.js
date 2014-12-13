require('basis.ui');

var ajax = require('basis.net.ajax');

var list = new basis.ui.Node({
    template: resource('./template/list.tmpl')
});

var Item = basis.ui.Node.subclass({
    template: resource('./template/item.tmpl'),
    binding: {
        name: function(node){
            return node.name;
        },
        id: function(node){
            return node.id;
        }
    }
});

list.setChildNodes([
    new Item({ name: 'foo' }),
    new Item({ name: 'bar' }),
    new Item({ name: 'baz' })
]);

module.exports = list;

ajax.request({
    url: 'http://localhost:8888/teams',
    handler: {
        success: function(transport, request, response){
            var arr = [];
            for(var i in response){
                if(response.hasOwnProperty(i)){
                    arr.push(new Item(response[i]));
                }
            }

            list.setChildNodes(arr);
        },
        failure: function(transport, request, error){
            console.log('response error:', error);
        }
    }
});