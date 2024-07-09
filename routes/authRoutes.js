const express = require("express");
const { login, logout, googleAuth } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {db} = require("../db.js")
const passport = require('passport');

const router = express.Router()


router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').exists().withMessage('Password is required')
], login)


router.get('/logout', logout)

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    db.query('SELECT * FROM signup WHERE email = ?', [email], (err, rows) => {
        done(err, rows[0]);
    });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, googleAuth));

router.use(passport.initialize());
router.use(passport.session());


// Routes for Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('landing');
    }
);

// router.post('/logout', logout)

module.exports = router;