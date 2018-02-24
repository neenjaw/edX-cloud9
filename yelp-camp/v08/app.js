// ============================
// Node Requires
// ============================

const express  = require('express');

const mongoose = require('mongoose');

const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

// ============================
// Route Includes
// ============================

const indexRoutes      = require('./routes/index');
const campgroundRoutes = require('./routes/campground');
const commentRoutes    = require('./routes/comment');

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

// seed.seedDB();

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
// Routes
// ============================

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// ============================
// Server Start / Listen
// ============================

app.listen(3000, 'localhost', () => {
    console.log('Yelp-Camp Server starting on localhost:3000');
});
