'use strict';

/**
 * Module dependencies.
 */
var config              = require('./config');

var express             = require('express');
var bootable            = require('bootable');

// End of Dependencies


var app = bootable(express());


// Setup initializers
app.phase(bootable.initializers('app/setup/initializers'));

// Setup params
//app.phase(bootable.initializers('app/params'));

// Setup environments
app.phase(require('bootable-environment')('app/setup/environments', app));

// Setup routes
app.phase(bootable.routes('app/routes', app));


app.boot(function (err) {
    if (err) throw err;
    app.listen(config.get('express:port'), function () {
        console.log('Express listen port', config.get('express:port'));
    });
});
