'use strict';

/**
 * Module dependencies.
 */
var config              = require('../config');

var express             = require('express');
var jade = require('jade');
// End of dependencies.



module.exports.login = function(req, response) {

    var model = {success: false, username: '', password: ''};
    var node_env = process.env.NODE_ENV || 'demo';

    if(node_env != 'production'){
        model.username = 'victor@local';
        model.password = 'victor1';
    }

    var body = jade.renderFile('app/views/login.jade', {
        user : req.user,
        username: 'victor@local',
        password: 'victor1',
        authenticationWasFail: response.hasOwnProperty('authenticationWasFail') && response.authenticationWasFail
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};

module.exports.build = function(req, response) {

    var body = jade.renderFile('app/views/build.jade', { user : req.user });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};

module.exports.dev = function(req, response) {

    var body = jade.renderFile('app/views/dev.jade', { user : req.user });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};