'use strict';

/**
 * Module dependencies.
 */
var log                 = require('winston-wrapper')(module);
var config              = require('../config');

var requireTree         = require('require-tree');
var controllers         = requireTree('../controllers');
var express             = require('express');

// End of dependencies.


module.exports = function () {

    // Get user credentials if exists, and provide some data to views.

    // Render index page
    this.get('/', controllers.render.index);
    this.get('/build', controllers.render.build);

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
//    "/login": usersController.login,
//    "/register": usersController.register,
//    "/logout": usersController.logout


    //    "/day-types": dayTypesController.index,
//    "/public-holidays": publicHolidaysController.index,
//    "/set-type": setTypeController.index,



  //// Auth user by express.basicAuth. On success create field `req.user`.
  //this.get('/login', controllers.auth.login(config.get('credentials')), controllers.redirect('/'));
  //
  //// logout
  //this.get('/logout', controllers.auth.logout('/'));
  //
  //// editor for create or update posts.
  //this.get('/posts/new', controllers.render('editor'));
  //
  //// editor for create or update posts.
  //this.post('/posts', controllers.post.create(), controllers.redirect('/'));
  //
  //// Render post
  //this.get('/posts/:post', controllers.render('post'));
  //
  //// Render editor for post
  //this.get('/posts/:post/edit', controllers.render('editor'));
  //
  //// Update post
  //this.post('/posts/:post/', controllers.post.update(), controllers.redirect('/'));
  //
  //// Remove post
  //this.get('/posts/:post/remove', controllers.post.remove(), controllers.redirect('/'));
  //
  //
  //
  //
  //
  //// Return compiled stylus-file.
  //this.get('/stylesheets/main.css', controllers.stylus('stylus/main.styl', ['nib']));

};