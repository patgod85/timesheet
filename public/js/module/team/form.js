var ui = require('basis.ui');
var button = require('basis.ui.button');
var form = require('basis.ui.form');


var ajax = require('basis.net.ajax');
var moment = require('../../../components/moment/moment.js');

var FormInput = require('../form/text.js');

var TeamsTree = require('../admin/index.js');

module.exports = form.Form.subclass({
    name: 'TeamForm',
    template: resource('./template/form.tmpl'),
    satellite: {
        submitButton: {
            instance: button.Button.subclass({
                caption: 'Save',
                click: function () {
                    this.owner.submit();
                }
            })
        },
        addEmployeeButton: {
            instance: button.Button.subclass({
                caption: 'Add new employee',
                click: function () {
                    var d = this.owner.data;
                    var newVar = {
                        path: d.path + d.code + '/',
                        team_code: d.code,
                        id: 0,
                        name: "New employee",
                        surname: "New employee",
                        work_start: moment().format('YYYY-MM-DD'),
                        work_end: null,
                        days: {},
                        team_id: d.id,
                        maternity_leaves: [],
                        position: ""
                    };
                    this.owner.owner.data.Employee(newVar);

                    // This is a "Kostil" because for empty team dataSourceChanged event doesn't emit
                    this.owner.owner.getChildByName('TeamsTree').setDataSource([]);
                    this.owner.owner.getChildByName('TeamsTree').setDataSource(this.owner.owner.data.employeesAndUsersByTeams.getSubset('/'));
                }
            })
        },
        addUserButton: {
            instance: button.Button.subclass({
                caption: 'Add new user',
                click: function () {
                    var d = this.owner.data;
                    var newVar = {
                        path: d.path + d.code + '/',
                        team_code: d.code,
                        id: 0,
                        name: "New user",
                        surname: "New user",
                        is_super: false,
                        team_id: d.id
                    };
                    this.owner.owner.data.User(newVar);

                    // This is a "Kostil" because for empty team dataSourceChanged event doesn't emit
                    this.owner.owner.getChildByName('TeamsTree').setDataSource([]);
                    this.owner.owner.getChildByName('TeamsTree').setDataSource(this.owner.owner.data.employeesAndUsersByTeams.getSubset('/'));
                }
            })
        }
    },
    binding: {
        submitButton: "satellite:",
        addEmployeeButton: "satellite:",
        addUserButton: "satellite:"
    },
    childFactory: function(config){
        return new FormInput(config);
    },
    childNodes: [
        {type: "text", title: 'Name', name: 'name'},
        {type: "text", title: 'Code', name: 'code'}
    ],
    onSubmit: function(){
        var self = this;
        ajax.request({
            url: '/app/team/update',
            method: 'POST',
            contentType: "application/json",
            body: JSON.stringify(self.data),
            handler: {
                success: function(){
                    self.owner.delegate.setAndDestroyRemoved();
                    alert("Team successfully updated");
                },
                failure: function(){
                    alert("Update of team is failed");
                }
            }
        });
    }
});
