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


module.exports = function(selectedYear, updateGlobalYear){
    var Node = basis.ui.Node.subclass({
        template: resource('./template/index.tmpl'),
        action: {
            setYear: function(event){
                updateGlobalYear(event.sender.value);
            }
        }
    });
    var years = [
        '2013',
        '2014',
        '2015',
        '2016'
    ];
    var childNodes = [];
    for(var i in years){
        if(years.hasOwnProperty(i)){
            childNodes.push(new Option({name: years[i], selected: selectedYear == years[i]}))
        }
    }


    var node = new Node();

    node.setChildNodes(childNodes);

    return  node;
};