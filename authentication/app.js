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

app.use(require('express-session')({
  secret: 'This is the app secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//
// express middleware
//

app.get('/', (req, res) => {
  res.render('home');
}); // end app.get /

app.get('/secret', (req, res) => {
  res.render('secret');
});

//
// Auth Routes
//

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let user = req.body.user;

  User.register(new User({username: user.username}), user.password, (err) => {
    if (err) {
      console.log(err);
      return res.render('/register');
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/secret');
    });
  });
});

//
// App Listen
//

app.listen(3000, 'localhost', () => {
  console.log('app started');
});