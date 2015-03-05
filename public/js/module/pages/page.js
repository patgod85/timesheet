basis.require('basis.ui');

module.exports = basis.ui.Node.subclass({
    template:
        '<div class="page page-{unselected}">' +
            '{name}' +
        '</div>',
    binding: {
        name: 'name'
    }
});
