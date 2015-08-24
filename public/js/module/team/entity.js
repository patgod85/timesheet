var entity = require('basis.entity');

module.exports = new entity.EntityType({
    name: 'TeamEntity',
    fields: {
        path: String,
        team_code: String,
        code: String,
        id: entity.IntId,
        name: String,
        shifts: Object
    }
});
