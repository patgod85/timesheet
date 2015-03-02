basis.require('basis.ui');

module.exports = basis.ui.Node.subclass({
    container: document.getElementById('page'),
    template: '<div>Page</div>',
    selection: true,
    childClass: {
        template:
            '<div class="page page-{unselected}">' +
                '{name}' +
            '</div>',
        binding: {
            name: 'name'
        }
    }
});
