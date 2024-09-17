const express = require('express');
const { register, login, addFriend, getUser, getFriends, getStrangers } = require('../controllers');

const jwt_middleware = require('./jwt_middleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addFriend', jwt_middleware, addFriend);

router.get('/getUser', jwt_middleware, getUser);
router.get('/getFriends', jwt_middleware, getFriends);
router.get('/getStrangers', jwt_middleware, getStrangers);

module.exports = router;
