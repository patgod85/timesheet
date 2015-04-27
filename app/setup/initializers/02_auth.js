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

    var User = require('../../domain/user');

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {

        User.findByNameAndPassword(
            username,
            password,
            function(err,user){

                function sanitizeAndDone(user){
                    delete user.password;
                    done(null, user);
                }

                return err
                    ? done(err)
                    : user
                    ? password === user.password
                    ? sanitizeAndDone(user)
                    : done(null, false, { message: 'Incorrect password.' })
                    : done(null, false, { message: 'Incorrect username.' });
            }
        );
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err,user){
            err
                ? done(err)
                : done(null,user);
        });
    });

    done();
};