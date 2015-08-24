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
    this.post('/app/team/update', controllers.team.update);
    this.post('/app/employee/update', controllers.employee.update);
    this.post('/app/set-type', controllers.setter.setType);
    this.post('/app/set-shift', controllers.setter.setShift);
    this.post('/app/public-holidays/update', controllers.publicHolidays.update);
    this.post('/app/user/update', controllers.users.updateBySuperUser);
    this.post('/app/profile/update', controllers.users.updateProfile);

    this.get('/app/login', controllers.render.login);
    this.post('/app/login', controllers.users.login);
    this.get('/app/whoami', controllers.users.whoami);
    this.get('/app/logout', controllers.users.logout);

    this.get('/app/model', controllers.model);
};