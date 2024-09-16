const { register, login, getUser } = require('./user_controll');
const { getNotFriends } = require('./friend_controll');

module.exports = { 
    register, 
    login, 
    getUser, 
    getNotFriends, 
};