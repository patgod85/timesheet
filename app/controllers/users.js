var passport = require("passport");
var jade = require('jade');
var userRepository = require('../domain/user');

var requireTree = require('require-tree');
var controllers = requireTree('.');

function result(res, body, contentType){

    if(!contentType){
        contentType = "application/json";
    }

    res.writeHead(200, {
        "content-type": contentType,
        "content-length": body.length
    });

    res.write(body);
    res.end();
}

module.exports.login = function(req, res, next) {
    passport.authenticate('local',
        function(err, user) {

            res.authenticationWasFail = true;

            return err
                ? next(err)
                : user
                ? req.logIn(user, function(err) {
                    return err
                        ? next(err)
                        : res.redirect('/');
                })
                : controllers.render.login(req, res);
        }
    )(req, res, next);
};

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/login');
};

module.exports.register = function(req, res, next) {
    var user = new User({ username: req.body.email, password: req.body.password});
    user.save(function(err) {
        return err
            ? next(err)
            : req.logIn(user, function(err) {
            return err
                ? next(err)
                : res.redirect('/private');
        });
    });
};

module.exports.whoami = function(req, res) {

    if(req.user){
        result(res, JSON.stringify({success: true, user: req.user}));
    }else{
        result(res, JSON.stringify({success: false}));
    }
};

module.exports.updateBySuperUser = function(request, response){

    var user = request.body;

    userRepository
        .isSuper(request.user)
        .then(function(){
            return userRepository.updateBySuperUser(user);
        })
        .then(function(){

            var body = JSON.stringify({success: true});

            response.writeHead(200, {
                "content-type": "application/json",
                "content-length": body.length
            });

            response.write(body);
            response.end();
        })
        .catch(function(){
            response.writeHead(400, {});
            response.write('Action failed');
            response.end();
        });
};

module.exports.updateProfile = function(request, response){

    var user = request.body;

    userRepository
        .update(request.user, user)
        .then(function(){

            var body = JSON.stringify({success: true});

            response.writeHead(200, {
                "content-type": "application/json",
                "content-length": body.length
            });

            response.write(body);
            response.end();
        })
        .catch(function(){
            response.writeHead(400, {});
            response.write('Action failed');
            response.end();
        });
};