var express = require('express');
var cors = require('cors');

exports.start = function(folderName){

    var app = express();

    var oneYear = 31557600000;
    app.use(cors());
    app.use(express.static(folderName, { maxAge: oneYear }));
    app.use(express.errorHandler());

    app.listen(process.env.PORT || 3000);

};