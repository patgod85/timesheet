var entity = require('basis.entity');

module.exports = new entity.EntityType({
    name: 'TeamEntity',
    fields: {
        path: String,
        team_code: String,
        code: String,
        id: basis.entity.IntId,
        name: String
    }
});
