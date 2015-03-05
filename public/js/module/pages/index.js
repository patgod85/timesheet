basis.require('basis.ui');


module.exports = basis.ui.Node.subclass({
    container: document.getElementById('page'),
    template: '<div>Page</div>',
    selection: true,
    childFactory: function(PageClass) {
        return new PageClass({
            delegate: this.delegate,
            router: this.router
        });
    }
});

