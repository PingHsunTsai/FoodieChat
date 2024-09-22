const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const Conversation = require('./conversation');

const ConversationUsers = sequelize.define('ConversationUsers', {
    conversationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Conversation,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = ConversationUsers;
