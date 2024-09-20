const { createToken, authenticateToken } = require('./token_controll');
const { register, login, getUser } = require('./user_controll');
const { addFriend, getFriends, getStrangers } = require('./friend_controll');

module.exports = { 
    createToken,
    authenticateToken,
    register, 
    login, 
    addFriend,
    getUser, 
    getFriends,
    getStrangers, 
};