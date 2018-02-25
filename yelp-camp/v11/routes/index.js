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

    if (req.session.register) {

        res.locals.username = req.session.register.username;
        res.locals.password = req.session.register.password;
        res.locals.displayName = req.session.register.displayName;

        delete req.session.register;
    }
    
    res.render('auth/register', {pageName: 'auth/register'});
});

// Handle Register Logic
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const displayName = req.body.displayName;

    function makeSessionVars() {
        req.session.register = {
            username, password, displayName
        };
    }

    if (!isValidInput('username', username)) {
        makeSessionVars();
        res.flash('warning', 'Not a valid username: alpha-numeric, must start with a letter, at least 6 characters');
        return res.redirect('/register');
    }

    if (!isValidInput('password', password)) {
        makeSessionVars();
        res.flash('warning', 'Not a valid password: alpha-numeric, between 5 and 16 characters');
        return res.redirect('/register');
    }

    if (!isValidInput('displayName', displayName)) {
        makeSessionVars();
        res.flash('warning', 'Not a valid display name: alpha-numeric, at least 3 characters');
        return res.redirect('/register');
    }

    // Make a new user, then register it with passport
    const newUser = new User({username, displayName});
    User.register(newUser, password, (err, user) => {
        if (err) {
            // console.log(err);
            makeSessionVars();
            res.flash('warning', err.message);
            return res.redirect('/register');
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

function isValidInput(type, input) {
    const types = {
        username: {
            pattern: '[a-zA-Z]{1}[a-zA-Z_]{5,}'
        },
        password: {
            pattern: '[a-zA-Z0-9]{5,16}'
        },
        displayName: {
            pattern: '[a-zA-Z0-9]{3,}'
        }
    };

    if (!(type in types)) {
        return undefined;
    } 

    const re = new RegExp(types[type].pattern);

    return input.match(re);
}

module.exports = router;