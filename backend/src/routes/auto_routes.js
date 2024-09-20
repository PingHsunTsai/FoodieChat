const express = require('express');
const { register, login, addFriend, getUser, getFriends, getStrangers } = require('../controllers');
const { authenticateToken } = require('../controllers');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addFriend', authenticateToken, addFriend);

router.get('/getUser', authenticateToken, getUser);
router.get('/getFriends', authenticateToken, getFriends);
router.get('/getStrangers', authenticateToken, getStrangers);

module.exports = router;
