'use strict';

/**
 * Module dependencies.
 */
var config              = require('../config');

var requireTree         = require('require-tree');
var controllers         = requireTree('../controllers');
var express             = require('express');

// End of dependencies.


module.exports = function () {

    // Get user credentials if exists, and provide some data to views.

    // Render index page
    this.get('/login', controllers.render.index);
    this.get('/dev', controllers.render.dev);
    this.get('/', controllers.render.build);

    // editor for create or update posts.
    this.get('/teams', controllers.teams);
    this.get('/team/', controllers.team({}));
    this.get('/day-types', controllers.dayTypes({}));
    this.post('/set-type', controllers.setType);
    this.get('/public-holidays', controllers.publicHolidays({}));

    this.get('/whoami', controllers.users.whoami);
    this.post('/login', controllers.users.login);
    this.get('/register', controllers.users.register);
    this.get('/logout', controllers.users.logout);

    this.get('/model', controllers.model);
};