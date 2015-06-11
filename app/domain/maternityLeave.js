var Vow = require("vow");
var sqlite = require('./sqlite');
var moment = require('moment');

module.exports.getAll = function(){

    return new Vow.Promise(function(resolve, reject){

        sqlite.connect()
            .then(sqlite.serialize)
            .then(function(db){

                sqlite.all(db, "SELECT * FROM maternity_leave")
                    .then(function (maternity_leave) {
                        var viewModel = {};

                        for(var i = 0; i < maternity_leave.length; i++){
                            if(!viewModel.hasOwnProperty(maternity_leave[i].employee_id)){
                                viewModel[maternity_leave[i].employee_id] = [];
                            }

                            if(!maternity_leave[i].date_end){
                                maternity_leave[i].date_end_or_today = moment().format("YYYY-MM-DD");
                                maternity_leave[i].date_end = '';
                            }

                            viewModel[maternity_leave[i].employee_id].push(maternity_leave[i]);
                        }

                        resolve(viewModel);
                    })
                    .catch(reject);
            });
    });
};

module.exports.update = function(maternityLeave){

    var dateRegExp = /^\d{4}-\d{1,2}-\d{1,2}$/;

    if(maternityLeave.date_start && !dateRegExp.test(maternityLeave.date_start) || maternityLeave.date_end && !dateRegExp.test(maternityLeave.date_end)){
        return new Vow.Promise(function(resolve, reject){
            reject();
        });
    }

    if(maternityLeave.id){
        return new Vow.Promise(function(resolve, reject){

            sqlite.connect()
                .then(sqlite.serialize)
                .then(function(db){

                    var query = "UPDATE maternity_leave "
                        + " SET date_start = ?, date_end = ? "
                        + " WHERE id = ?";

                    var params = [
                        maternityLeave.date_start,
                        maternityLeave.date_end,
                        maternityLeave.id
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

                    var query = "INSERT INTO maternity_leave "
                        + " (employee_id, date_start, date_end) "
                        + " VALUES (?, ?, ?) ";

                    var params = [
                        maternityLeave.employee_id,
                        maternityLeave.date_start,
                        maternityLeave.date_end
                    ];

                    sqlite.run(db, query, params)
                        .then(resolve)
                        .catch(reject);
                });
        });
    }


};