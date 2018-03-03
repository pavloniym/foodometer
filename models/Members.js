
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('members', {
        chats_id: {type: DataTypes.INTEGER, allowNull: false, unique: 'chat_member'},
        users_id: {type: DataTypes.INTEGER, allowNull: false, unique: 'chat_member'},
        name: {type: DataTypes.STRING},
        username: {type: DataTypes.STRING}
    }, {
        paranoid: true,
    });
}