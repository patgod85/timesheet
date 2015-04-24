var passport = require("passport");
var jade = require('jade');

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
    result(res, jade.renderFile('app/views/logout.jade', {  }), "text/html");
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