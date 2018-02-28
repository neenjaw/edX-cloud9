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

// Show User Profile Page
router.get('/:uid', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.uid)
        .populate('campgrounds')
        .populate('comments')
        .exec((err, user) => {
            res.locals.profileUser = {
                id: user._id,
                username: user.username,
                name: user.displayName,
                created: user.created,
                updated: user.updated,
                campgrounds: user.campgrounds.map(campground => {
                    return {
                        id: campground._id,
                        name: campground.name,
                        description: campground.description,
                        image: campground.image,
                        location: campground.location,
                        created: campground.created,
                        updated: campground.updated
                    };
                }),
                comments: user.comments.map(comment => {
                    return {
                        text: comment.text,
                        created: comment.created,
                        updated: comment.updated
                    };
                })
            };

            res.render('users/show');
        });
});

// Show User Account Page
router.get('/:uid/edit', middleware.isThisUserAuthorized, (req, res) => {
    function getSessionVarsFromErr() {
        const result = req.session.userUpdate;
        delete req.session.userUpdate;

        return result;
    }

    res.locals.update = getSessionVarsFromErr();
    if (!res.locals.update) {
        delete res.locals.update;
    }
    
    User.findById(req.params.uid)
        .exec((err, foundUser) => {
            res.locals.editUser = {
                id: foundUser._id,
                username: foundUser.username,
                name: foundUser.displayName,
                created: foundUser.created,
                updated: foundUser.updated,
                isAdmin: foundUser.isAdmin,
                password: '********'
            };

            res.render('users/edit');
        });
});

router.put('/:uid', middleware.isThisUserAuthorized, (req, res) => {

    const update = {};

    //the the display name is different, prepare for update
    update.displayName = req.body.editUser.name;

    if (req.body.editUser.oldPassword && req.body.editUser.newPassword && req.body.editUser.rptPassword) {
        update.changepw = true;
        update.oldPassword = req.body.editUser.oldPassword;
        update.newPassword = req.body.editUser.newPassword;
        update.rptPassword = req.body.editUser.rptPassword;

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

//TODO: Need a user delete route
router.delete('/:uid', (req, res) => {
    const uid = req.params.uid;


    // 1. Delete User
    // 2. make a list of all the campgrounds
    // 3. make a list of all the comments associated with all of the campgrounds
    // 4. delete the campgrounds
    // 5. delete the comments
    // 6. Update user's comments ref
    // 7. update campground comments ref

    // 1.
    User.findById(uid)
        .populate({
            path: 'campgrounds',
            populate: {
                path: 'comments' 
            }
        })
        .exec((err, rUser) => {
            if(err) {
                console.log(err);
                res.flash('danger', 'An error was encountered deleting the user');
                res.redirect('back');
            } else {
                // 2.
                const rCampgrounds = rUser.campgrounds;
                const rComments = rCampgrounds
                    .reduce((accumulator, currentValue) => accumulator.concat(currentValue.comments), removedUser.comments);

                const affectedUsers = rComments.map(comment => comment.author);
                const affectedComments = rComments.map(comment => comment._id);
                const affectedCampgrounds = rComments.map(comment => comment.campground);

                User.updateMany(
                    { _id : { $in: affectedUsers }},
                    { comments: { $pull: { $in: affectedComments }}},
                    (err) => {

                        Campground
                            .updateMany(
                                { _id : { $in : affectedCampgrounds }},
                                { comments: { $pull: { $in: affectedComments }}},
                                (err) => {

                                    // //still need to remove the comments
                                    // Comment.deleteMany()
                                    // //still need to remove the user
                                    // User.findByIdAndRemove()
                                    // //still need to remove the campground
                                    // Campground.findByIdAndRemove
                                });
                    });
            }

        });
});


module.exports = router;