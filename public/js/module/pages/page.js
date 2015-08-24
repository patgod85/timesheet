var ui = require('basis.ui');

module.exports = ui.Node.subclass({
    template: resource('./template/index.tmpl'),
    binding: {
        name: 'title'
    }
});
