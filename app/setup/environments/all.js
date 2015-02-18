'use strict';

/**
 * Module dependencies.
 */
var log                 = require('winston-wrapper')(module);
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
    //this.use(express.urlencoded()); // Replace for depricated connect.bodyParser()
    //this.use(express.json()); // Replace for depricated connect.bodyParser()

    // parse application/x-www-form-urlencoded
    this.use(express.bodyParser());

    //this.use(bodyParser.urlencoded({ extended: false }));
    //this.use(bodyParser.json());
    this.use(express.methodOverride());


    //this.use(express.bodyParser());
    //this.use(express.session({
    //    secret: config.get('session:secret'),
    //    key: 'session_cookie_name'
    //}));

    this.use(express.cookieParser('SUPERsekret'));
    this.use(express.cookieSession());

    this.use(passport.initialize());
    this.use(passport.session());

    this.use(cors({
        credentials: true,
        origin: 'http://localhost:8000'
    }));

    this.use(this.router);
    this.use(express.static('public'));


};