'use strict';

/**
 * Module dependencies.
 */
var log                 = require('winston-wrapper')(module);
var config              = require('../../config');

//var Post                = require('mongoose').model('Post');
//var auth                = require('../../controllers/auth');
var express = require('express');


// Setup variables for jade
module.exports = function (done) {


    // Provide user to jade if it exists
    this.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });


    done();

    //this.use(function(request, response, next) {
    //
    //    // When dealing with CORS (Cross-Origin Resource Sharing)
    //    // requests, the client should pass-through its origin (the
    //    // requesting domain). We should either echo that or use *
    //    // if the origin was not passed.
    //    var origin = (request.headers.origin || "*");
    //
    //
    //    // Check to see if this is a security check by the browser to
    //    // test the availability of the API for the client. If the
    //    // method is OPTIONS, the browser is check to see to see what
    //    // HTTP methods (and properties) have been granted to the
    //    // client.
    //    if (request.method.toUpperCase() === "OPTIONS"){
    //
    //
    //        // Echo back the Origin (calling domain) so that the
    //        // client is granted access to make subsequent requests
    //        // to the API.
    //        response.writeHead(
    //            "204",
    //            "No Content",
    //            {
    //                "access-control-allow-origin": origin,
    //                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    //                "access-control-allow-headers": "content-type, accept",
    //                "access-control-max-age": 10, // Seconds.
    //                "content-length": 0
    //            }
    //        );
    //
    //        // End the response - we're not sending back any content.
    //        return( response.end() );
    //    }
    //
    //    //res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    //    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //    response.setHeader("access-control-allow-origin", "http://localhost:8000");
    //    next();
    //});

  //// Get posts
  //this.use(function (req, res, next) {
  //  Post.find(null, '_id title date', function (err, posts) {
  //    err
  //      ? next(err)
  //      : res.locals.posts = posts,
  //        next();
  //  });
  //});


  //// Check auth
  //this.use(auth.check(config.get('credentials')));




};