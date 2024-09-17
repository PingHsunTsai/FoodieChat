const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Friend = sequelize.define('Friend', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    friendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Each friendId references a User
Friend.belongsTo(User, { foreignKey: 'friendId', as: 'friend' });

module.exports = Friend;
