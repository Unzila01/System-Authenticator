const { body, validationResult } = require('express-validator');
const { db } = require('../db.js');
const bcrypt = require("bcryptjs");

const signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.query("SELECT email FROM signup WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send({ error: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).send({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = {
            email: email,
            password: hashedPassword
        };

        db.query("INSERT INTO signup SET ?", newUser, (error, result) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).send({ error: 'Database error' });
            }
            res.status(201).send({ message: 'User registered successfully!' });
        });
    });
};

// Google OAuth Strategy
const googleAuth = (accessToken, refreshToken, profile, done) => {
    db.query('SELECT * FROM signup WHERE email = ?', [profile.emails[0].value], (err, rows) => {
        if (err) return done(err);

        if (!rows.length) {
            const newUser = {
                email: profile.emails[0].value,
                password: 'password123' // Example password, adjust as needed
            };
            db.query('INSERT INTO signup SET ?', newUser, (err, result) => {
                if (err) return done(err);
                newUser.id = result.insertId;
                return done(null, newUser);
            });
        } else {
            return done(null, rows[0]);
        }
    });
};

// GitHub OAuth Strategy
const githubAuth = (accessToken, refreshToken, profile, done) => {
    console.log('Received profile:', JSON.stringify(profile, null, 2)); // Log the entire profile object

    // Check if profile or profile.emails is undefined
    if (!profile || !profile.emails || profile.emails.length === 0) {
        console.error('Invalid profile data:', profile);
        return done(new Error('Invalid profile data'));
    }

    // Extract email from the first entry in profile.emails array
    const email = profile.emails[0].value;

    // Query the database to check if the user already exists
    db.query('SELECT * FROM signup WHERE email = ?', [email], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return done(err);
        }

        if (!rows.length) {
            // If user doesn't exist, create a new user
            const newUser = {
                email: email,
                password: 'password1234' // Example password, adjust as needed
            };

            // Insert new user into the database
            db.query('INSERT INTO signup SET ?', newUser, (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return done(err);
                }
                newUser.email = result.email;
                return done(null, newUser);
            });
        } else {
            // If user exists, return user data
            return done(null, rows[0]);
        }
    });
};



module.exports = { signup, googleAuth, githubAuth };
