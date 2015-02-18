'use strict';

/**
 * Module dependencies.
 */
var log                 = require('winston-wrapper')(module);
var config              = require('../config');

var express             = require('express');
var jade = require('jade');
// End of dependencies.



module.exports = function(req, response) {

    var body = jade.renderFile('app/views/login.jade', { user : req.user });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};