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
    this.get('/dev', controllers.render.dev);
    this.get('/', controllers.render.build);

    // editor for create or update posts.
    //this.get('/teams', controllers.teams);
    //this.get('/team/', controllers.team.index({}));
    this.post('/team/update', controllers.team.update);
    this.post('/employee/update', controllers.employee.update);
    //this.get('/day-types', controllers.dayTypes({}));
    this.post('/set-type', controllers.setType);
    this.post('/public-holidays/update', controllers.publicHolidays.update);
    this.post('/user/update', controllers.users.updateBySuperUser);
    this.post('/profile/update', controllers.users.updateProfile);

    this.get('/login', controllers.render.login);
    this.post('/login', controllers.users.login);
    this.get('/whoami', controllers.users.whoami);
    //this.get('/register', controllers.users.register);
    this.get('/logout', controllers.users.logout);

    this.get('/model', controllers.model);
};