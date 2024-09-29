const { Op } = require('sequelize');
const { Message, User, Conversation }  = require('../models');
const { messageEventEmitter } = require('./even_control');

const findOrCreateConversation = async (userId, participants) => {

    try {
        const existingConversation = await findConversationByParticipants(participants);

        if (existingConversation) {
            return existingConversation;
        }

        const newConversation = await Conversation.create({
            type: participants.length > 2 ? 'group' : 'single', // Set to 'group' if more than 2 participants
            creatorId: userId
        });

        await newConversation.addParticipants(participants);

        return newConversation;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Failed to find or create conversation' });
    }
};

const findConversationByParticipants = async (participants) => {
    const conversations = await Conversation.findAll({
        include: {
            model: User,
            as: 'participants',
            through: {
                attributes: []
            },
            where: {
                id: { [Op.in]: participants }
            }
        }
    });

    // Filter conversations that have exactly the same participants
    return conversations.find(conversation => {
        const conversationParticipants = conversation.participants.map(user => user.id);
        return conversationParticipants.length === participants.length && 
               conversationParticipants.every(id => participants.includes(id));
    });
};

exports.sendMsg = async (req, res) => {
    const { senderId, conversationId, content } = req.body;

    try {
        const newMessage = await Message.create({ 
            senderId, 
            conversationId: conversationId,
            content 
        });

        messageEventEmitter.emit('newMessage', newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Endpoint for real-time chat using SSE(get)
exports.streamMsg = async (req, res) => {
    const { userId } = req.params;
    const { receiverId } = req.query;
    const parsedUserId = parseInt(userId);
    const parsedReceiverId = parseInt(receiverId);
    const participants = [parsedUserId, parsedReceiverId];

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const conversation = await findOrCreateConversation(userId, participants);
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    const allMessages = await Message.findAll({
        where: { conversationId: conversation.id },
        order: [['createdAt', 'ASC']] // Send messages in ascending order of creation time
    });

    const responseData = {
        conversationId: conversation.id,
        msg: allMessages,
    };

    res.write(`data: ${JSON.stringify(responseData)}\n\n`);

    // Listen for new messages via EventEmitter with id check to avoid unnecessary updates
    const messageListener = async (newMessage) => {
        if (newMessage.conversationId === conversation.id) {
            const updatedMessages = await Message.findAll({
                where: { conversationId: conversation.id },
                order: [['createdAt', 'ASC']]
            });
            responseData.msg = updatedMessages;
            res.write(`data: ${JSON.stringify(responseData)}\n\n`);
        }
    };
    messageEventEmitter.on('newMessage', messageListener);

    req.on('close', () => {
        messageEventEmitter.removeListener('newMessage', messageListener); 
        res.end();
    });
};
