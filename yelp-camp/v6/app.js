// ============================
// Node Requires
// ============================

const express  = require('express');

const mongoose = require('mongoose');


const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

// ============================
// Mongoose Connect
// ============================

mongoose.connect('mongodb://localhost/yelpcamp');

// ============================
// Mongoose Schema Requires
// ============================

const User       = require('./models/user');
const Campground = require('./models/campground');
const Comment    = require('./models/comment');

const seed       = require('./seed');

seed.seedDB();

// ============================
// Express Setup 
// ============================

const app = express();

// View Engine
app.set('view engine', 'ejs');
// Body Parsing
app.use(express.urlencoded({extended: true}));
// Static File Serve Dir
app.use(express.static(__dirname + '/public'));
// Session
app.use(require('express-session')({
  secret: 'n33BjOLuNncxtuYXpbux',
  resave: false,
  saveUninitialized: false,
}));

// Startup Passport
app.use(passport.initialize());
app.use(passport.session());
// Config Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// ============================
// Express Routes
// ============================

//LANDING
app.get('/', (req, res) => {
  res.render('landing', {pageName:'landing'});
});

// ============================
// CAMPGROUND ROUTES
// ============================

//INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {

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

// ============================
// COMMENT ROUTES
// ============================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

// ============================
// Auth Routes
// ============================

// Show Register Form
app.get('/register', (req, res) => {
  res.render('auth/register', {pageName: 'auth/register'});
});

// Handle Register Logic
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const displayName = req.body.displayName;

  // Make a new user, then register it with passport
  const newUser = new User({username, displayName});
  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Show Login
app.get('/login', (req, res) => {
  res.render('auth/login', {pageName: 'auth/login'});
});

// Handle Login Logic
app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {
});

// Show Logout Form
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect('/login');
}

// ============================
// Server Start / Listen
// ============================

app.listen(3000, 'localhost', () => {
  console.log('Yelp-Camp Server starting on localhost:3000');
});
