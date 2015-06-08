'use strict';

/**
 * Module dependencies.
 */
var config              = require('../../config');

var express = require('express');

// End of dependencies.
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

// Setup variables for jade
module.exports = function (done) {

    var UserRepository = require('../../domain/user');

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {

        UserRepository.findByNameAndPassword(username, password)
            .then(function(user){
                done(null, user);
            })
            .catch(function(){
                done(null, false, { message: 'Incorrect username or password' });
            })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        UserRepository.findById(id, function(err,user){
            err
                ? done(err)
                : done(null,user);
        });
    });

    done();
};