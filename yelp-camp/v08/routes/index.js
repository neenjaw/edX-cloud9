// ============================
// Node Requires
// ============================

const express  = require('express');
const passport = require('passport');

// ============================
// Express Router Setup
// ============================

const router = express.Router();

// ============================
// Mongoose Model Requires
// ============================

const User = require('../models/user');

// ============================
// Index / Auth Routes
// ============================

// Landing Route
router.get('/', (req, res) => {
    res.render('landing', {pageName:'landing'});
});

// Show Register Form
router.get('/register', (req, res) => {
    res.render('auth/register', {pageName: 'auth/register'});
});

// Handle Register Logic
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const displayName = req.body.displayName;

    // Make a new user, then register it with passport
    const newUser = new User({username, displayName});
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// Show Login
router.get('/login', (req, res) => {
    res.render('auth/login', {pageName: 'auth/login'});
});

// Handle Login Logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
});

// Handle Logout Logic
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;