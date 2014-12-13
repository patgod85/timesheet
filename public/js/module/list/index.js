require('basis.ui');

var ajax = require('basis.net.ajax');

var list = new basis.ui.Node({
    container: document.body,
    template: resource('./template/list.tmpl')
});

var Item = basis.ui.Node.subclass({
    template: resource('./template/item.tmpl'),
    binding: {
        name: function(node){
            return node.name;
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
    params: {
        userId: 123
    },
    handler: {
        success: function(transport, request, response){
            var arr = [];
            for(var i in response){
                if(response.hasOwnProperty(i)){
                    arr.push(new Item({ name: response[i].name }));
                }
            }

            list.setChildNodes(arr);
        },
        failure: function(transport, request, error){
            console.log('response error:', error);
        }
    }
});