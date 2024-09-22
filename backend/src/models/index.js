// backend/models/index.js
const User = require('./user');
const Message = require('./message');
const Friend = require('./friend');
const Conversation = require('./conversation');
const ConversationUsers = require('./conversationUsers');

// Define the relationships between models here
Conversation.belongsToMany(User, {
     through: ConversationUsers, 
     as: 'participants', 
     foreignKey: 'conversationId'
});
User.belongsToMany(Conversation, { 
    through: ConversationUsers, 
    as: 'userConversations', 
    foreignKey: 'userId' 
});

Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });


// Sync models
const syncModels = async () => {
    await User.sync();
    await Message.sync();
    await Friend.sync();
    await Conversation.sync();
    await ConversationUsers.sync();
    console.log('Models synced');
};

module.exports = {
    User,
    Message,
    Friend,
    Conversation,
    ConversationUsers,
    syncModels,
};
