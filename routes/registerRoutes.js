const express = require("express");
const passport = require('passport');
const { db } = require('../db.js');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { signup, googleAuth, githubAuth } = require('../controllers/registerController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Passport configuration (Move session config to server.js)
passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    db.query('SELECT * FROM signup WHERE email = ?', [email], (err, rows) => {
        if (err) {
            return done(err);
        }
        if (!rows.length) {
            return done(new Error('User not found'));
        }
        return done(null, rows[0]); // Pass the retrieved user object to done
    });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/register/google/callback'
}, googleAuth));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/register/github/callback'
}, githubAuth));

// Routes for Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // console.log("Success");
        res.redirect('/landing');
    }
);

// Routes for GitHub OAuth
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/landing');
    }
);

// Route for user signup
router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
], signup);

module.exports = router;
