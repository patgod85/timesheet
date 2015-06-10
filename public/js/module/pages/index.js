basis.require('basis.ui');


module.exports = basis.ui.Node.subclass({
    container: document.getElementById('page'),
    template: resource('./template/pages.tmpl'),
    selection: true,
    childFactory: function(PageClass) {
        return new PageClass({
            delegate: this.delegate,
            router: this.router
        });
    },
    binding: {
        styles_for_types: function(node){

            var style = "";

            for(var i in node.data.dayTypes){
                if(node.data.dayTypes.hasOwnProperty(i)){
                    var type = node.data.dayTypes[i];

                    style += " .type_" + type.id + "{"
                        + "background-color: #" + type.background_color + " !important;"
                        + "color: #" + type.color + " !important;"
                        + "}";

                    if(type.title){
                        style += " .type_" + type.id + " span:before {"
                            + "content: \"" + type.title + "\" !important;"
                            + "}";
                    }
                }
            }

            return style;
        }
    }
});

