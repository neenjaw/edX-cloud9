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
// Middleware
// ============================

const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }

    req.session.returnToPath = req.session.returnToPath || req.originalUrl;
    res.flash('warning', 'Please log in first!');
    res.redirect('/login');
};

middlewareObj.isThisCampgroundOwner = function (req, res, next) {
    // is user logged in?
    if (!req.isAuthenticated()) {

        //if not, redirect to log in
        req.session.returnToPath = req.session.returnToPath || req.originalUrl;
        res.flash('warning', 'Please log in first!');
        res.redirect('/login');
    
    } else {
        //continue with edit
        const id = req.params.id;
    
        Campground
            .findById(id)
            .exec((err, campground) => {
                if (err) {
                    res.flash('danger', 'There has been an error!');                        
                    res.redirect('/campgrounds');
                } else {
                    if (!campground) {
                        res.flash('danger', 'This campground does not exist');
                        return res.redirect('/campgrounds');
                    }

                    //does the user own the campground?
                    if (!campground.author.equals(req.user._id)) {
                        res.flash('danger', 'You are not authorized to edit this page!');                        
                        res.redirect(`/campgrounds/${id}`);
                    } else {
                        req.campground = campground;
                        next();
                    }
                }
            });
    }
};

// check if this is the comment owner
middlewareObj.isThisCommentOwner = function (req, res, next) {
    // is user logged in?
    if (!req.isAuthenticated()) {
        
        //if not, redirect to log in
        req.session.returnToPath = req.session.returnToPath || req.originalUrl;
        res.flash('warning', 'Please log in first!');
        res.redirect('/login');
    
    } else {
        //continue with edit
        const id = req.params.commentId;
    
        Comment
            .findById(id)
            .exec((err, comment) => {
                if (err) {
                    res.flash('danger', 'There has been an error!');                        
                    res.redirect('back');
                } else {

                    if (!comment) {
                        res.flash('danger', 'This comment does not exist');
                        return res.redirect('/campgrounds');
                    }

                    //does the user own the comment?
                    if (!comment.author.equals(req.user._id)) {
                        res.flash('danger', 'You are not authorized to edit this comment!');                        
                        res.redirect('back');
                    } else {
                        req.comment = comment;
                        next();
                    }
                }
            });
    }
};

module.exports = middlewareObj;