const { Op } = require('sequelize');
const Friend = require('../models/friend');
const User = require('../models/User');

exports.addFriend = async (req, res) => {
    const { friendId } = req.body;
    try {
        const friend = await Friend.create({
            userId: req.user.id,
            friendId,
        });
        res.status(201).json({ message: 'Friend added', friend });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add friend' });
    }
};

exports.removeFriend = async (req, res) => {
    const { id } = req.params;
    try {
        await Friend.destroy({
            where: {
                userId: req.user.id,
                friendId: id,
            },
        });
        res.status(200).json({ message: 'Friend removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove friend' });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const friends = await Friend.findAll({
            where: { userId: req.user.id },
            include: [{ model: User, as: 'friend' }],
        });
        res.status(200).json({ friends });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
};


exports.getNotFriends = async (req, res) => {
    try {
        const friends = await Friend.findAll({
            where: { userId: req.user.id },
            attributes: ['friendId'],
        });
        const friendIds = friends.map(friend => friend.friendId);

        const excludeIds = friendIds.length > 0 ? friendIds.concat(req.user.id) : [req.user.id];

        const notFriends = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: excludeIds,  // Exclude friends and the logged-in user
                },
            },
            attributes: ['id', 'userName'],
        });

        res.status(200).json(notFriends);
    } catch (error) {
        console.error('Error fetching non-friends:', error);
        res.status(500).json({ error: 'Failed to fetch non-friends' });
    }
};
