const { createToken, authenticateToken } = require('./token_controll');
const { register, login, getUser } = require('./user_controll');
const { addFriend, getFriends, getStrangers } = require('./friend_controll');
const { sendMsg, streamMsg } = require('./message_control');
const { messageEventEmitter } = require('./even_control');

module.exports = { 
    createToken,
    authenticateToken,
    register, 
    login, 
    addFriend,
    getUser, 
    getFriends,
    getStrangers, 
    sendMsg,
    streamMsg,
    messageEventEmitter,
};