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

const Campground = require('../models/campground');
const User = require('../models/user');

// ============================
// Index / Auth Routes
// ============================

// Landing Route
router.get('/', (req, res) => {
    res.render('landing', {pageName:'landing'});
});

// Show the Admin Panel
router.get('/admin', (req, res) => {  // TODO: remove this <-- put this back in later middleware.isThisUserAdmin, (req, res) => {
    Campground
        .find()
        .populate('author')
        .exec((err, campgrounds) => {
            if (err) {
                res.flash('danger', 'An error occured while getting campgrounds for the admin panel');
                res.redirect('/campgrounds');
            } else {
                //put the campgrounds into locals for use in the template
                res.locals.campgrounds = campgrounds.map(campground => {
                    return {
                        id: campground._id,
                        name: campground.name,
                        image: campground.image,
                        description: campground.description,
                        price: ((campground.priceInCents / 100).toFixed(2)),
                        location: campground.location,
                        lat: campground.lat,
                        lng: campground.lng,
                        author: {
                            username: campground.author.username,
                            name: campground.author.displayName
                        },
                        created: campground.created,
                        updated: campground.updated
                    };
                });

                //now get the users
                User.find()
                    .exec((err, users) => {
                        if (err) {
                            res.flash('danger', 'An error occured while getting users for the admin panel');
                            res.redirect('/campgrounds');
                        } else {
                            res.locals.users = users.map(user => {
                                return {
                                    id: user._id,
                                    username: user.username,
                                    password: '********',
                                    name: user.displayName,
                                    created: user.created,
                                    updated: user.updated,
                                    isAdmin: user.isAdmin
                                };
                            });

                            res.render('auth/admin');
                        }
                    });
            }
        });
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
        res.flash('warning', 'Not a valid username: alpha-numeric, must start with a letter, at least 6 characters'+username);
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
            // disable eslint for this line since the string represents an uncompiled regex
            // eslint-disable-next-line no-useless-escape
            pattern: '[a-zA-Z]{1}[a-zA-Z0-9_-]{5,20}'
        },
        password: {
            pattern: '[a-zA-Z0-9]{5,20}'
        },
        displayName: {
            // disable eslint for this line since the string represents an uncompiled regex
            // eslint-disable-next-line no-useless-escape
            pattern: '[a-zA-Z0-9_-]{3,20}'
        }
    };

    if (!(type in types)) {
        return undefined;
    } 

    const re = new RegExp(types[type].pattern);

    return input.match(re);
}

module.exports = router;