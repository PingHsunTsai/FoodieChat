const { register, login, getUser } = require('./user_controll');
const { addFriend, getFriends, getStrangers } = require('./friend_controll');

module.exports = { 
    register, 
    login, 
    addFriend,
    getUser, 
    getFriends,
    getStrangers, 
};