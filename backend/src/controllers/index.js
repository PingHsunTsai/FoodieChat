const { register, login, getUser } = require('./user_controll');
const { getFriends, getStrangers } = require('./friend_controll');

module.exports = { 
    register, 
    login, 
    getUser, 
    getFriends,
    getStrangers, 
};