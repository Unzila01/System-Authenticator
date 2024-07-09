const { body, validationResult } = require('express-validator');
const {db} = require('../db.js')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const login = (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const { email, password } = req.body;
    

    db.query("SELECT * FROM signup WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        req.session.token = token;
        req.session.email = user.email;

        res.cookie('token', token, { maxAge: 60*60*1000, httpOnly: true });
        res.status(200).send({ token });
    });
}


const logout = (req, res) => {
    if(req.session.token || req.cookies.token){
        res.clearCookie('token')
        req.session.destroy()
        console.log("Logged Out!")
        res.redirect('/')
    }
    else{
        res.status(201).json({ message : "Session Not Found!"})
        res.redirect('/')
    }
}


const googleAuth = (accessToken, refreshToken, profile, done) => {
    db.query('SELECT * FROM signup WHERE email = ?', [profile.emails[0].value], (err, rows) => {
        if (err) return done(err);

        if (!rows.length) {
            const newUser = {
                // google_id: profile.id,
                // name: profile.displayName,
                email: profile.emails[0].value,
                password: 'password123'
            };
            db.query('INSERT INTO signup SET ?', newUser, (err, result) => {
                if (err) return done(err);
                newUser.email = result.email;
                return done(null, newUser);
            });
        } else {
            return done(null, rows[0]);
        }
    });
}

module.exports = { login, logout, googleAuth }