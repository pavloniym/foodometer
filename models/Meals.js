
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('meals', {
        chats_id: {type: DataTypes.INTEGER, allowNull: false},
        payers_id: {type: DataTypes.INTEGER, allowNull: true},
        confirmed: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}
    });
}