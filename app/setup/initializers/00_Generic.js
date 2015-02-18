'use strict';

/**
 * Module dependencies.
 */
var log                 = require('winston-wrapper')(module);
var config              = require('../../config');

// End of dependencies.


module.exports = function (done) {

  process.env.PORT
    && config.set('express:port', process.env.PORT);

  done();

};