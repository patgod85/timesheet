var entity = require('basis.entity');

module.exports = new entity.EntityType({
    name: 'UserEntity',
    fields: {
        path: String,
        team_code: String,
        id: basis.entity.IntId,
        name: String,
        surname: String,
        team_id: String,
        is_super: Boolean
    }
});
