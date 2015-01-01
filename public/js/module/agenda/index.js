require('basis.ui');
var ajax = require('basis.net.ajax');

module.exports = function (applyTypeCallback) {

    var node = new basis.ui.Node({
        container: document.getElementById('placeHolder'),
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


    ajax.request({
        url: 'http://localhost:8888/day-types',
        handler: {
            success: function (transport, request, response) {
                var arr = [];
                for (var i in response) {
                    if (response.hasOwnProperty(i)) {
                        arr.push({
                            id: response[i].id,
                            name: response[i].name
                        });
                    }
                }
                node.setChildNodes(arr);
            },
            failure: function (transport, request, error) {
                console.log('response error:', error);
            }
        }
    });
};
