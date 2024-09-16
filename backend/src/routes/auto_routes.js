const express = require('express');
const { register, login, getUser } = require('../controllers');
const { getNotFriends } = require('../controllers/friend_controll');

const jwt_middleware = require('./jwt_middleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/getUser', jwt_middleware, getUser);
router.get('/getNotFriends', jwt_middleware, getNotFriends);

module.exports = router;
