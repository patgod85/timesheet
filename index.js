var express = require("./app/http/express");
var server = require("./app/http/server");
var router = require("./app/http/router");

var indexController = require("./app/controllers/indexController");
var teamsController = require("./app/controllers/teamsController");

var handle = {};
handle["/"] = indexController.index;
handle["/teams"] = teamsController.teams;

server.start(router.route, handle);
express.start(__dirname + '/public');

