const express               = require('express');
const mongoose              = require('mongoose');
const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');


//
// mongoose setup
//

mongoose.connect('mongodb://localhost/authdemo');

const User = require('./models/user');

//
// express setup
//

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(require('express-session')({
  secret: 'This is the app secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//
// express middleware
//

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret');
});

//
// Auth Routes
//

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.log(err);
      
      return res.render('register');
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/secret');
    });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

// LOGIN
// render login form
app.get('/login', (req, res) => {
  res.render('login');  
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}), (req, res) => {
});

// LOGOUT
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//
// App Listen
//

app.listen(3000, 'localhost', () => {
  console.log('app started');
});