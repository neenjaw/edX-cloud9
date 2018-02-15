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
          campground.comments.push(comment._id);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;