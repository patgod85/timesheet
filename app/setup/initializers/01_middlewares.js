'use strict';

/**
 * Module dependencies.
 */
var config              = require('../../config');

var express = require('express');


// Setup variables for jade
module.exports = function (done) {


    // Provide user to jade if it exists
    this.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });


    done();
};