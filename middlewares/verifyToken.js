const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // return res.status(401).send({ error: 'Unauthorized: No token provided' });
        return res.redirect('/')
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            // return res.status(401).send({ error: 'Unauthorized: Invalid token' });
            return res.redirect('/')
        }
        req.user = decoded;
        return next();
    });
}

module.exports = {verifyToken}