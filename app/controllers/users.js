var passport = require("passport");
var jade = require('jade');
var userRepository = require('../domain/user');

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

            return err
                ? next(err)
                : user
                ? req.logIn(user, function(err) {
                    return err
                        ? next(err)
                        : result(res, JSON.stringify({"success": true, user: user}));
                })
                : result(res, JSON.stringify({"success": false}));
        }
    )(req, res, next);
};

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
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

module.exports.update = function(request, response){

    var user = request.body;

    userRepository
        .isSuper(request.user)
        .then(function(){
            return userRepository.update(user);
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