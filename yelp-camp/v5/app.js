const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  seed = require('./seed');

//
// mongoose schema setup
//

const Campground = require('./models/campground');
const Comment = require('./models/comment');

//
// mongoose setup
//

mongoose.connect('mongodb://localhost/yelpcamp');

seed.seedDB();

//
// express setup
//

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//
// express middleware
//

app.get('/', (req, res) => {
  res.render('landing', {pageName:'landing'});
}); // end app.get /


//INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {

  //get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {

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
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new', {pageName: 'new'});
}); // end app.get / campgrounds/new

//SHOW - show a campground's detail
app.get('/campgrounds/:id', (req, res) => {
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
        comments: campground.comments.map((comment) => {
          return {
            id: comment._id,
            text: comment.text,
            author: comment.author
          };
        })
      };

      console.log(campground);
      res.render('campgrounds/show', {pageName: 'campgrounds/show', campground});
    }
  });
});

// ============================
// COMMENTS ROUTES
// ============================

app.get('/campgrounds/:id/comments/new', (req, res) => {
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

app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(3000, 'localhost', () => {
  console.log('Yelp-Camp Server starting on localhost:3000');
});
