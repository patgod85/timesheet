'use strict';

/**
 * Module dependencies.
 */
var config              = require('../../config');

var express             = require('express');

// End of dependencies.


module.exports = function () {
  this.use(express.errorHandler());
};