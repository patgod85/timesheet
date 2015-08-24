var entity = require('basis.entity');

module.exports = new entity.EntityType({
    name: 'UserEntity',
    fields: {
        path: String,
        team_code: String,
        id: entity.IntId,
        email: String,
        name: String,
        surname: String,
        team_id: String,
        is_super: Boolean,
        is_enabled: Boolean,
        new_password: String
    }
});
