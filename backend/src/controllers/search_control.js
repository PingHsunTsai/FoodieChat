const { Friend, User }  = require('../models');

var LevenshteinDistance = function(word1, word2) {
    // TODO: CHeckout Jaro-Winkler distance
    // fast implementation of longestCommonPrefix
    const longestCommonPrefix = (w1, w2) => {
        let i = 0;
        while (i < w1.length && i < w2.length && w1[i] === w2[i]) {
            i++;
        }
        return i; // length of the common prefix
    };

    const lcpLength = longestCommonPrefix(word1, word2);

    const pd = [];
    for (let i = 0; i < word1.length + 1; i++) {
        pd.push(new Array(word2.length + 1).fill(0));  
    }
    for (let i = 0; i < word1.length + 1; i++) {
        pd[i][word2.length] = word1.length - i
    } 
    for (let j = 0; j < word2.length + 1; j++) {
        pd[word1.length][j] = word2.length - j
    }
    // pd (EX1)
    // [      r  o  s  ''
    //    h [ 0, 0, 0, 5 ],
    //    o [ 0, 0, 0, 4 ],
    //    r [ 0, 0, 0, 3 ],
    //    s [ 0, 0, 0, 2 ],
    //    e [ 0, 0, 0, 1 ],
    //   '' [ 3, 2, 1, 0 ]
    // ]

    for (let i = word1.length-1; i >= 0; i--) {
        for (let j = word2.length-1; j >= 0; j--) {
            if (word1[i] === word2[j]) {
                pd[i][j] = pd[i+1][j+1];
            } else {
                pd[i][j] = 1 + Math.min(
                    // Delete
                    pd[i+1][j],
                    // Insert 
                    pd[i][j+1],
                    // Replace
                    pd[i+1][j+1]
                );
            }
        };
    };

    const levenshteinDistance = pd[0][0]

    const adjustmentFactor = 0.5; // Reduce more if the prefix is long (adjust this factor as needed)
    const finalScore = levenshteinDistance - lcpLength * adjustmentFactor;
    return finalScore;
};

exports.searchUsers = async (req, res) => {
    const query = req.query.q;

    try {
        const users = await User.findAll();
        const userNames = users.map(user => user.userName);

        // Use fuzzball to find matches based on the search query
        const results = userNames.map(userName => {
            const distance = LevenshteinDistance(query, userName);
            return { userName, distance };  // Store the username and distance
        });
        console.log('Results:', results);
        results.sort((a, b) => a.distance - b.distance);
        // Map the results back to the users
        const matchedUsers = results.map(result => {
            return users.find(user => user.userName === result.userName);
        });

        res.status(200).json(matchedUsers);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ success: false, error: 'Search failed' });
    }
};