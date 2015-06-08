var ajax = require('basis.net.ajax');

module.exports = {
    whoami: function(done, fail){
        return new ajax.Transport({
            url: '/whoami',
            method: 'GET',
            handler: {
                success: function (transport, request, response) {
                    if (response.success) {
                        done(response);
                    }
                    else{
                        fail(response);
                    }

                }
            }
        })
    },
    signIn: function(done) {
        return new ajax.Transport({
            url: '/login',
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
