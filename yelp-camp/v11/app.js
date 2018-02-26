// ============================
// Node Requires
// ============================

const express  = require('express');
const mongoose = require('mongoose');

const flash            = require('express-flash-2');
const methodOverride   = require('method-override');
const expressSanitizer = require('express-sanitizer');

const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const reload = require('reload');

// ============================
// Route Includes
// ============================

const indexRoutes      = require('./routes/index');
const userRoutes       = require('./routes/user');
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

app.set('port', process.env.PORT || 3000);

// View Engine
app.set('view engine', 'ejs');

// Body Parsing
app.use(express.urlencoded({extended: true}));

// Sanitize the incoming body
app.use(expressSanitizer());

// Static File Serve Dir
app.use(express.static(__dirname + '/public'));

// Method Override
app.use(methodOverride('_method'));

// Session
app.use(require('express-session')({
    secret: 'n33BjOLuNncxtuYXpbux',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

app.locals.moment = require('moment');

// ============================
// Passport Setup 
// ============================

// Startup Passport
app.use(passport.initialize());
app.use(passport.session());

// Config Passport
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============================
// Misc Setup 
// ============================

// Include the user data in each response for the render template
app.use((req, res, next) => {
    if (typeof req.user === 'undefined') {
        res.locals.user = undefined;
    } else {
        res.locals.user = {
            id: req.user._id,
            username: req.user.username,
            name: req.user.displayName,
            isAdmin: req.user.isAdmin
        };
    }

    next();
});

// ============================
// Routes
// ============================

app.use(indexRoutes);
app.use('/users', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// ============================
// Server Start / Listen
// ============================
reload(app);

app.listen(app.get('port'), 'localhost', () => {
    console.log('Yelp-Camp Server starting on localhost:3000');
});
