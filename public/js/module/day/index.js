require('basis.ui');

module.exports = basis.ui.Node.subclass({
    data: {
        name: '',
        weekend: false,
        type: ''
    },
    template: resource('./template/index.tmpl'),
    binding: {
        name: 'data:name',
        weekend: 'data:weekend',
        type: 'data:type'
    }
});
