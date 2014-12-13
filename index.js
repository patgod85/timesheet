var express = require("./app/http/express");
var server = require("./app/http/server");
var router = require("./app/http/router");

var indexController = require("./app/controllers/indexController");
var teamsController = require("./app/controllers/teamsController");
var teamController = require("./app/controllers/teamController");

var handle = {
    "/": indexController.index,
    "/teams": teamsController.index,
    "/team/": teamController.index
};


server.start(router.route, handle);
express.start(__dirname + '/public');

