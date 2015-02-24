'use strict';

/**
 * Module dependencies.
 */
var config              = require('../../config');

var express             = require('express');
var pwd                 = require('process-pwd');
var loggerformat        = require('up-express-logger');

var cors = require('cors');
// End of dependencies.
//var bodyParser = require('body-parser');
var passport = require('passport');
// End of dependencies.


module.exports = function () {
    this.set('port', config.get('express:port'));
    this.set('views', pwd + '/views');
    this.set('view engine', 'jade');

    this.use(express.favicon());
    this.use(express.logger(loggerformat));

    // parse application/x-www-form-urlencoded
    this.use(express.bodyParser());

    this.use(express.methodOverride());


    this.use(express.cookieParser('SUPERsekret'));
    this.use(express.cookieSession());

    this.use(passport.initialize());
    this.use(passport.session());

    this.use(cors({
        credentials: true,
        origin: 'http://localhost:8000'
    }));

    this.use(express.static('public/components', {maxAge: '1d'}));
    this.use(express.static('public'));

    this.use(this.router);
};