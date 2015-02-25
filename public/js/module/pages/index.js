basis.require('basis.ui');

module.exports.controller = basis.ui.Node.subclass({
    container: document.getElementById('page'),
    template: '<div>Page</div>',
    selection: true,
    //childClass: basis.ui.Node.subclass,
    childClass: {
        template:
            '<div class="page page-{unselected}">' +
                '{name}' +
            '</div>',
        binding: {
            name: 'name'
        }
    }/*,
    childNodes: [
        {name: 'team'},
        {name: 'publicHolidays'}
    ]*/
});
