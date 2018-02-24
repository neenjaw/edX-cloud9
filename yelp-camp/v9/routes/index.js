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
    // console.log(req.headers.referer);
    
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
            // console.log(err);
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
    failureRedirect: '/login'
}), (req, res) => {
    const path = req.session.returnToPath || '/campgrounds';
    delete req.session.returnToPath;

    res.flash('success', 'Successfully logged in!');

    res.redirect(path);
});

// Handle Logout Logic
router.get('/logout', (req, res) => {
    req.logout();
    res.flash('secondary', 'Successfully logged out.');
    res.redirect('/campgrounds');
});

module.exports = router;