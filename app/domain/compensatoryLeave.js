var Vow = require("vow");
var sqlite = require('./sqlite');
var moment = require('moment');

module.exports.getAll = function(){

    return new Vow.Promise(function(resolve, reject){

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db){

                sqlite.all(db, "SELECT * FROM compensatory_leave")
                    .then(function (compensatory_leave) {
                        var viewModel = {};

                        for(var i = 0; i < compensatory_leave.length; i++){
                            if(!viewModel.hasOwnProperty(compensatory_leave[i].employee_id)){
                                viewModel[compensatory_leave[i].employee_id] = [];
                            }

                            viewModel[compensatory_leave[i].employee_id].push(compensatory_leave[i]);
                        }

                        resolve(viewModel);
                    })
                    .catch(reject);
            });
    });
};

module.exports.update = function(compensatoryLeave){

    var dateRegExp = /^\d{4}-\d{1,2}-\d{1,2}$/;

    if(compensatoryLeave.date && !dateRegExp.test(compensatoryLeave.date) || !compensatoryLeave.description){
        return new Vow.Promise(function(resolve, reject){
            reject();
        });
    }

    if(compensatoryLeave.id){
        return new Vow.Promise(function(resolve, reject){

            sqlite.connect()
                .then(sqlite.serialize)
                .then(function(db){

                    var query = "UPDATE compensatory_leave "
                        + " SET date = ?, description = ?, value = ? "
                        + " WHERE id = ?";

                    var params = [
                        compensatoryLeave.date,
                        compensatoryLeave.description,
                        compensatoryLeave.value,
                        compensatoryLeave.id
                    ];

                    sqlite.run(db, query, params)
                        .then(resolve)
                        .catch(reject);
                });
        });
    }else{
        return new Vow.Promise(function(resolve, reject){

            sqlite.connect()
                .then(sqlite.serialize)
                .then(function(db){

                    var query = "INSERT INTO compensatory_leave "
                        + " (employee_id, date, description, `value`) "
                        + " VALUES (?, ?, ?, ?) ";

                    var params = [
                        compensatoryLeave.employee_id,
                        compensatoryLeave.date,
                        compensatoryLeave.description,
                        parseFloat(compensatoryLeave.value)
                    ];

                    sqlite.run(db, query, params)
                        .then(resolve)
                        .catch(reject);
                });
        });
    }


};