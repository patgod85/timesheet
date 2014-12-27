require('basis.ui');

var Option = basis.ui.Node.subclass({
    template: resource('./template/option.tmpl'),
    binding: {
        name: function (node) {
            return node.name;
        },
        selected: function(node){
            return node.selected;
        }
    }
});


module.exports = function(selectedMonth, updateGlobalMonth){
    var Node = basis.ui.Node.subclass({
        template: resource('./template/index.tmpl'),
        action: {
            setMonth: function(event){
                updateGlobalMonth(event.sender.value);
            }
        }
    });
    var months = [
        'January',
        'February',
        'March',
        'April'
    ];
    var childNodes = [];
    for(var i in months){
        if(months.hasOwnProperty(i)){
            childNodes.push(new Option({name: months[i], selected: selectedMonth == months[i]}))
        }
    }


    var node = new Node();

    node.setChildNodes(childNodes);

    return  node;
};