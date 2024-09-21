const Message  = require('../models/message');

// Endpoint to send a message(post)
exports.sendMsg = async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    try {
        const newMessage = await Message.create({ senderId, receiverId, content });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Endpoint for real-time chat using SSE(get)
exports.streamMsg = async (req, res) => {
    const { userId } = req.params;

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to send a message as an SSE
    const sendEvent = (message) => {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    };

    // Example: Simulating a new message being received every 5 seconds (you'll replace this with real data)
    setInterval(async () => {
        const newMessages = await Message.findAll({ where: { receiverId: userId }, order: [['createdAt', 'DESC']], limit: 1 });
        console.log('back newMessages', newMessages);
        if (newMessages.length > 0) {
            sendEvent(newMessages[0]);
        }
    }, 5000);

    req.on('close', () => {
        console.log('Client disconnected');
        res.end();
    });
};
