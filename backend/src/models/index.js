// backend/models/index.js
const User = require('./User');
const Message = require('./message');
const Friend = require('./friend');
// const Conversation = require('./Conversation');
// const ConversationUsers = require('./ConversationUsers');

// Define the relationships between models here
// Conversation.belongsToMany(User, { through: ConversationUsers, as: 'participants', foreignKey: 'conversationId' });
// User.belongsToMany(Conversation, { through: ConversationUsers, as: 'userConversations', foreignKey: 'userId' });

// Sync models
const syncModels = async () => {
    await User.sync();
    await Message.sync();
    await Friend.sync();
    // await Conversation.sync();
    // await ConversationUsers.sync();
    console.log('Models synced');
};

module.exports = {
    User,
    Message,
    Friend,
    // Conversation,
    // ConversationUsers,
    syncModels,
};
