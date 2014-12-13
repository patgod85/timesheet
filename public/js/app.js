require('basis.ui');

new basis.ui.Node({
    container: document.body,
    childNodes: [
//        require('./hello.js'),
        require('./module/list/index.js')
    ]
});