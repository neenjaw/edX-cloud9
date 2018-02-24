// ============================
// Node Requires
// ============================

const express = require('express');
const router  = express.Router();

// ============================
// Mongoose Model Requires
// ============================

const Campground = require('../models/campground');

// ============================
// Campground Routes
// ============================

//INDEX - show all campgrounds
router.get('/', (req, res) => {

  //get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      //Valid Campground Result
      campgrounds = campgrounds.map((campground) => {
        return {
          name: campground.name,
          image: campground.image,
          id: campground._id
        };
      });

      console.log('> Showing Campground Index');

      res.render('campgrounds/index', {
        pageName: 'campgrounds/index',
        campgrounds
      });
    }
  });
});

//CREATE - add new campground
router.post('/', (req, res) => {
  let name = req.body.name,
    image = req.body.image,
    description = req.body.description;

  if (name && image) {

    Campground.create({ name, image, description }, (err) => { // , campground) => {
      if (err) {
        //TODO: eventually replace with a redirect to the form with error
        console.log(err);
      } else {
        console.log('> New Campground created');

        res.redirect('/campgrounds');
      }
    });

  }
});

//NEW - show form to create new campground
router.get('/new', (req, res) => {
  res.render('campgrounds/new', {pageName: 'new'});
}); // end app.get / campgrounds/new

//SHOW - show a campground's detail
router.get('/:id', (req, res) => {
  let id = req.params.id;

  console.log('> Looking for campground: ' + id);

  Campground.findById(id).populate('comments').exec((err, campground) => {
    if (err) {
      //TODO: eventually replace with a redirect to the form with error
      console.log(err);
    } else {
      console.log('> Campsite Found:');

      campground = {
        name: campground.name,
        image: campground.image,
        description: campground.description,
        id: campground._id,
        created: campground.created,
        comments: campground.comments.map((comment) => {
          return {
            id: comment._id,
            text: comment.text,
            author: comment.author,
            created: comment.created,
            updated: comment.updated
          };
        })
      };

      console.log(campground);
      res.render('campgrounds/show', {pageName: 'campgrounds/show', campground});
    }
  });
});

module.exports = router;