require('basis');

module.exports = new basis.entity.EntityType({
    name: 'TeamEntity',
    fields: {
        path: String,
        team_code: String,
        code: String,
        id: basis.entity.IntId,
        name: String
    }
});
