const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const alreadyLogged = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        return res.redirect('/landing')
    }
    return next()
}

module.exports = {alreadyLogged}