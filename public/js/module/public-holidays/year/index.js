require("basis.ui");
basis.require('basis.dom');
basis.require('basis.ui.button');
basis.require('basis.ui.calendar');

module.exports = function(year){
    return new basis.ui.calendar.Calendar({
        container: document.getElementById('placeHolder'),
        childNodes: ['Year', 'YearDecade']
    });
//    var Node = basis.ui.Node.subclass({
//        container: document.getElementById('placeHolder'),
//        template: resource("./template/index.tmpl"),
//        binding: {
//            year: 'data:year'
//        }
//    });
//    return new Node({data: {year: year}});
};