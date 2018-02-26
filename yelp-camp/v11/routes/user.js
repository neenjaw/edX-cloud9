// ============================
// Node Requires
// ============================

const express = require('express');
const passport = require('passport');
const middleware = require('../middleware');

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
// User / Admin Routes
// ============================

// Show the Admin Panel
router.get('/admin', (req, res) => { // put this back in later middleware.isThisUserAdmin, (req, res) => {
    Campground
        .find()
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
                        author: campground.author,
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
                                    username: user.username,
                                    password: '********',
                                    name: user.displayName,
                                    created: user.created,
                                    updated: user.updated,
                                    isAdmin: user.isAdmin
                                };
                            });

                            res.render('users/admin');
                        }
                    });
            }
        });
});

// Show User Account Page
router.get('/:uid', middleware.isThisUserAuthorized, (req, res) => {
    function getSessionVarsFromErr() {
        const result = req.session.userUpdate;
        delete req.session.userUpdate;

        return result;
    }

    res.locals.update = getSessionVarsFromErr();
    if (!res.locals.update) {
        delete res.locals.update;
    }
    
    res.locals.user = {
        id: req.user._id,
        username: req.user.username,
        name: req.user.displayName,
        created: req.user.created,
        updated: req.user.updated,
        isAdmin: req.user.isAdmin,
        password: '********'
    };

    res.render('users/show');

});

router.put('/:uid', middleware.isThisUserAuthorized, (req, res) => {

    const update = {};

    //the the display name is different, prepare for update
    update.changeName = (req.body.user.name !== req.user.displayName);
    update.displayName = req.body.user.name || req.user.displayName;

    if (req.body.user.oldPassword && req.body.user.newPassword && req.body.user.rptPassword) {
        update.changepw = true;
        update.oldPassword = req.body.user.oldPassword;
        update.newPassword = req.body.user.newPassword;
        update.rptPassword = req.body.user.rptPassword;

        if (update.newPassword !== update.rptPassword) {
            res.flash('warning', 'Your new password does not match');
            return res.redirect(`/users/${req.user._id}`);
        }
    }

    if (update.changepw) {
        req.user.changePassword(update.oldPassword, update.newPassword, (err) => {
            if (err) {
                makeSessionVarsForErr();

                res.flash('warning', 'Error updating password -- incorrect username/password combination.');
                res.redirect(`/users/${req.user._id}`);
            } else {
                res.flash('success', 'Your password has been updated!');
                updateDisplayName();
            }
        });
    } else {
        updateDisplayName();
    }

    //separated function to update name to make more DRY
    function updateDisplayName() {
        if (!update.changeName) {
            res.redirect(`/users/${req.user._id}`);
        } else {
            User.findByIdAndUpdate(req.user._id, { $set: { displayName: update.displayName } }, (err, updatedUser) => {
                if (err) {
                    makeSessionVarsForErr();

                    res.flash('danger', 'There was a problem updating your name. Try again later.');
                    res.redirect(`/users/${req.user._id}`);
                } else {
                    res.flash('success', 'Your name has been changed.');
                    res.redirect(`/users/${req.user._id}`);
                }
            });
        }
    }

    function makeSessionVarsForErr() {
        req.session.userUpdate = {
            changeName: update.changeName || false,
            name: update.displayName, 
            changePassword: update.changepw || false,
            oldPassword: update.oldPassword || undefined,
            newPassword: update.newPassword || undefined,
            rptPassword: update.rptPassword || undefined
        };
    }
});

module.exports = router;