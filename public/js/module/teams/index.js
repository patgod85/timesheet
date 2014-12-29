require('basis.ui');

var ajax = require('basis.net.ajax');

module.exports = function(changeTeam){

    var list = new basis.ui.Node({
        template: resource('./template/list.tmpl')
    });

    var Item = basis.ui.Node.subclass({
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
                //console.log(this.data);
                changeTeam(this.data.code);
            }
        }
    });

    list.setChildNodes([
        new Item({ data: {name: 'foo'} }),
        new Item({ name: 'bar' }),
        new Item({ name: 'baz' })
    ]);

    ajax.request({
        url: 'http://localhost:8888/teams',
        handler: {
            success: function(transport, request, response){
                var arr = [];
                for(var i in response){
                    if(response.hasOwnProperty(i)){
                        arr.push(new Item({data: response[i]}));
                    }
                }

                list.setChildNodes(arr);
            },
            failure: function(transport, request, error){
                console.log('response error:', error);
            }
        }
    });

    return list;
};

