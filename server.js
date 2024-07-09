const express = require("express");
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport'); // Include Passport

dotenv.config({ path: './.env' });

const app = express();

const db = require('./db.js') 

// Importing Routes
const authRoutes = require('./routes/authRoutes.js')
const registerRoutes = require('./routes/registerRoutes.js')

// Middlewares
const { verifyToken } = require('./middlewares/verifyToken.js')
const { alreadyLogged } = require('./middlewares/alreadyLogged.js')

app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(cookieParser())
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60*60*1000 } // Adjust cookie expiration as needed
}));

// Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth/', authRoutes);
app.use('/register/', registerRoutes);

// Example routes
app.get("/", alreadyLogged, (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.render('index');
});

app.get("/login", alreadyLogged, (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.render('login');
});

app.get("/landing", verifyToken, (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.render('landing');
});

app.get("/reset", alreadyLogged, (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.render('reset');
});

app.listen(5000, () => {
    console.log("Server started on Port 5000");
});
