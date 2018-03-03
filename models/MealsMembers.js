
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('meals_members', {
        meals_id: {type: DataTypes.INTEGER, allowNull: false, unique: 'meal_member', primaryKey: true},
        members_id: {type: DataTypes.INTEGER, allowNull: false, unique: 'meal_member', primaryKey: true},
    }, {
        timestamps: false
    });
};