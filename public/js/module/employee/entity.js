var entity = require('basis.entity');

module.exports = new entity.EntityType({
    name: 'EmployeeEntity',
    fields: {
        path: String,
        team_code: String,
        id: basis.entity.IntId,
        name: String,
        surname: String,
        work_start: String,
        work_end: String,
        days: Object,
        maternity_leaves: Object,
        compensatory_leaves: Object,
        team_id: String,
        position: String
    }
});
