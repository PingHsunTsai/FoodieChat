const express = require('express');
const controllers  = require('../controllers');
const { authenticateToken } = require('../controllers');

const router = express.Router();

router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/addFriend', authenticateToken, controllers.addFriend);

router.get('/getUser', authenticateToken, controllers.getUser);
router.get('/getFriends', authenticateToken, controllers.getFriends);
router.get('/getStrangers', authenticateToken, controllers.getStrangers);

router.get('/streamMsg/:userId', authenticateToken, controllers.streamMsg);
router.post('/sendMsg', authenticateToken, controllers.sendMsg);

module.exports = router;
