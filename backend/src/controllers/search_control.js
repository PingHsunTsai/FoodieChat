const fuzz = require('fuzzball');
const { Friend, User }  = require('../models');

exports.searchUsers = async (req, res) => {
    const query = req.query.q;

    try {
        const users = await User.findAll();
        const userNames = users.map(user => user.userName);

        // Use fuzzball to find matches based on the search query
        const results = fuzz.extract(query, userNames, { scorer: fuzz.partial_ratio });
        console.log('results:', results);
        // Map the results back to the users
        const matchedUsers = results.map(result => {
            const [userName] = result;
            return users.find(user => user.userName === userName);
        });

        res.status(200).json(matchedUsers);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ success: false, error: 'Search failed' });
    }
};