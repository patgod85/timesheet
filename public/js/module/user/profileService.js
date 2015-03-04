var ajax = require('basis.net.ajax');

module.exports = {
    whoami: function(done){
        return new ajax.Transport({
            url: 'http://localhost:8888/whoami',
            method: 'GET',
            handler: {
                success: function (transport, request, response) {
                    if (response.success) {
                        done(response);
                    }
                }
            }
        })
    },
    signIn: function(done) {
        return new ajax.Transport({
            url: 'http://localhost:8888/login',
            method: 'POST',
            contentType: "application/json",
            handler: {
                success: function (transport, request, response) {

                    if (response.success) {
                        done(response);
                    } else {
                        alert("Authentication failed");
                    }
                },
                failure: function () {
                    alert("Authentication failed");
                }
            }
        })
    }
};
