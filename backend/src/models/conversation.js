const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');

const Conversation = sequelize.define('Conversation', {
    type: {
        type: DataTypes.ENUM('single', 'group'),
        allowNull: false,
        defaultValue: 'single',
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = Conversation;
