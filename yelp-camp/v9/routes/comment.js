// ============================
// Node Requires
// ============================

const express = require('express');
const router  = express.Router({mergeParams: true});

// ============================
// Mongoose Model Requires
// ============================

const Campground = require('../models/campground');
const Comment    = require('../models/comment');

// ============================
// Comment Routes
// ============================

// NEW
router.get('/new', isLoggedIn, (req, res) => {
    let id = req.params.id;

    console.log('> Looking for campground: ' + id);

    Campground.findById(id).exec((err, campground) => {
        if (err) {
            //TODO: eventually replace with a redirect to the form with error
            console.log(err);
        } else {
            console.log('> Campsite Found:');

            campground = {
                name: campground.name,
                image: campground.image,
                description: campground.description,
                id: campground._id
            };

            console.log(campground);
            res.render('comments/new', {pageName: 'campgrounds/comments/new', campground});
        }
    });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
    let id = req.params.id;
    let comment = req.body.comment;

    //look up the campground
    Campground.findById(id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(comment, (err, comment) => {
                if (err) {
                    console.log(err);
                    res.redirect(`/campgrounds/${campground._id}`);
                } else {
                    
                    //add id to comment
                    comment.author = req.user._id;
                    //save comment
                    comment.save();

                    //push comment id to campground
                    campground.comments.push(comment._id);

                    //save campground
                    campground.save();
                    
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//EDIT
router.get('/:commentId/edit', isThisCommentOwner, (req, res) => {
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
});

//UPDATE
router.put('/:commentId', isThisCommentOwner, (req, res) => {
    const campgroundId = req.params.id;
    const commentId = req.params.commentId;

    const comment = req.body.comment;
    comment.updated = Date.now();

    const updateQuery = { $set: { text: comment.text, updated: comment.updated }};

    Comment
        .findByIdAndUpdate(commentId, updateQuery, (err, updatedComment) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            } else {
                console.log(updatedComment);
                res.redirect(`/campgrounds/${campgroundId}`);
            }
        });
});

//DELETE
router.delete('/:commentId', isThisCommentOwner, (req, res) => {
    const campgroundId = req.params.id;
    const commentId = req.params.commentId;

    if (!commentId && campgroundId) {
        res.redirect('back');
    } else if (!commentId || !campgroundId) {
        res.redirect('/campgrounds');
    } else {
        Comment
            .findByIdAndRemove(commentId, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('back');
                } else {
                    const query = { $pull: { comments: commentId }};

                    Campground
                        .findByIdAndUpdate(campgroundId, query, (err, campground) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.redirect(`/campgrounds/${campgroundId}`);
                            }
                        });
                }
            });
    }
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect('/login');
}

// check if this is the comment owner
function isThisCommentOwner(req, res, next) {
    // is user logged in?
    if (!req.isAuthenticated()) {
        //if not, redirect
        res.redirect('back');
    
    } else {
        //continue with edit
        const id = req.params.commentId;
    
        Comment
            .findById(id)
            .exec((err, comment) => {
                if (err) {
                    //TODO: eventually replace with a redirect to the form with error
                    res.redirect('back');
                } else {
                    //does the user own the campground?
                    if (!comment.author.equals(req.user._id)) {
                        res.redirect('back');
                    } else {
                        req.comment = comment;
                        next();
                    }
                }
            });
    }
}

module.exports = router;