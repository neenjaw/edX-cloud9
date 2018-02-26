// ============================
// Node Requires
// ============================

const express = require('express');
const router  = express.Router({mergeParams: true});
const middleware = require('../middleware');

// ============================
// Mongoose Model Requires
// ============================

const Campground = require('../models/campground');
const Comment    = require('../models/comment');
const User       = require('../models/user');

// ============================
// Comment Routes
// ============================

// NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;

    // console.log('> Looking for campground: ' + id);

    Campground.findById(id).exec((err, campground) => {
        if (err) {
            // console.log(err);
            res.flash('danger', `An error was encountered: ${err}`);
            res.redirect('back');
        } else {
            campground = {
                name: campground.name,
                image: campground.image,
                description: campground.description,
                id: campground._id
            };

            res.render('comments/new', {pageName: 'campgrounds/comments/new', campground});
        }
    });
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;
    let comment = req.body.comment;

    //look up the campground
    Campground.findById(id, (err, campground) => {
        if (err) {
            // console.log(err);
            res.flash('danger', `An error was encountered: ${err}`);
            res.redirect('/campgrounds');
        } else {

            if (!campground) {
                res.flash('danger', 'Cannot add a comment to a campground that does not exist');
                return res.redirect('back');
            }

            Comment.create(comment, (err, comment) => {
                if (err) {
                    // console.log(err);
                    res.flash('danger', `An error was encountered: ${err}`);
                    res.redirect(`/campgrounds/${id}`);
                } else {
                    comment.author = req.user._id;
                    comment.campground = campground._id;
                    comment.save();

                    req.user.comments.push(comment._id);
                    req.user.save();

                    //push comment id to campground
                    campground.comments.push(comment._id);
                    campground.save();
                    
                    res.flash('info', 'Your comment was posted.');
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//EDIT
router.get('/:commentId/edit', middleware.isThisCommentOwner, (req, res) => {
    Campground
        .findById(req.params.id, (err, campground) => {
            if (err || !campground) {
                res.flash('danger', 'Can\'t edit the comment on a non-existant campground');
                return res.redirect('/campgrounds');
            } else {
                res.render('comments/edit', {
                    pageName: 'campgrounds/comments/new',
                    campground: {
                        id: req.params.id
                    },
                    comment: {
                        id: req.comment._id,
                        text: req.comment.text
                    }
                });
            }
        });
});

//UPDATE
router.put('/:commentId', middleware.isThisCommentOwner, (req, res) => {
    const campgroundId = req.params.id;
    const commentId = req.params.commentId;

    const comment = req.body.comment;
    comment.updated = Date.now();

    const updateQuery = { $set: { text: comment.text, updated: comment.updated }};

    Comment
        .findByIdAndUpdate(commentId, updateQuery, (err, updatedComment) => {
            if (err) {
                // console.log(err);
                res.flash('danger', `An error was encountered: ${err}`);
                res.redirect(`/campgrounds/${campgroundId}/comments/${commentId}/edit`);
            } else {
                // console.log(updatedComment);
                res.flash('success', 'Your comment was updated!');
                res.redirect(`/campgrounds/${campgroundId}`);
            }
        });
});

//DELETE
router.delete('/:commentId', middleware.isThisCommentOwner, (req, res) => {
    const campgroundId = req.params.id;
    const commentId = req.params.commentId;

    if (!commentId && campgroundId) {
        res.flash('danger', 'An error was encountered.');
        res.redirect('back');
    } else if (!commentId || !campgroundId) {
        res.flash('danger', 'An error was encountered.');
        res.redirect('/campgrounds');
    } else {
        Comment
            .findByIdAndRemove(commentId, (err) => {
                if (err) {
                    // console.log(err);
                    res.flash('danger', `An error was encountered deleting the comment: ${err}`);
                    res.redirect(`/campgrounds/${campgroundId}`);
                } else {
                    const query = { $pull: { comments: commentId } };

                    Campground
                        .findByIdAndUpdate(campgroundId, query, (err, campground) => {
                            if (err) {
                                // console.log(err);
                                res.flash('danger', `An error was encountered deleting comment from campground: ${err}`);
                                res.redirect('back');
                            } else {
                                User.findByIdAndUpdate(req.user._id, query, (err) => {
                                    if (err) {
                                        res.flash('danger', `An error was encountered deleting comment from user history: ${err}`);
                                        res.redirect('back');
                                    } else {
                                        res.flash('info', 'Your comment was sucessfully deleted.');
                                        res.redirect(`/campgrounds/${campgroundId}`);
                                    }
                                });
                            }
                        });
                }
            });
    }
});

module.exports = router;