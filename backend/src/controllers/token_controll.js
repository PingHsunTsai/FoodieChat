const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

exports.createToken = (user) =>{
    const privateKey = fs.readFileSync(path.join(process.env.JWT_PRIVATE_KEY));
    const token = jwt.sign(
        { id: user.id }, 
        privateKey, 
        { algorithm: 'RS256', expiresIn: '1h' }
    );
    return token;
}

exports.authenticateToken = (req, res, next) => {
    const publicKey = fs.readFileSync(path.join(process.env.JWT_PUBLIC_KEY));
    const token = req.headers['authorization'];
    
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(
        token.split(' ')[1], 
        publicKey, 
        { algorithms: ['RS256'] },
        (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = decoded;
            next();
    });
};
