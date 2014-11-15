var express = require('express');

exports.start = function(folderName){

    var app = express();

    app.use(express.static(folderName));

    app.listen(process.env.PORT || 3000);

};