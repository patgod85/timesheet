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

// Здесь мы проверяем, передаем данные о пользователе в функцию верификации, котоую мы определили выше.
// Вообще, passport.authenticate() вызывает метод req.logIn автоматически, здесь же я указал это явно. Это добавляет удобство в отладке. Например, можно вставить сюда console.log(), чтобы посмотреть, что происходит...
// При удачной авторизации данные пользователя будут храниться в req.user
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

// Здесь все просто =)
module.exports.logout = function(req, res) {
    req.logout();
    result(res, jade.renderFile('app/views/logout.jade', {  }), "text/html");
};

// Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
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