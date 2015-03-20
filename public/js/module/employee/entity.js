require('basis');

module.exports = new basis.entity.EntityType({
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
        team_id: String
    }
});
