'use strict';

/**
 * Module dependencies.
 */
var config              = require('../../config');

// End of dependencies.


module.exports = function (done) {

  process.env.PORT
    && config.set('express:port', process.env.PORT);

  done();

};