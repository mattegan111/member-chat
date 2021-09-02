const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcryptjs')
const session = require('express-session');
const mongoose = require("mongoose");
const secrets = require('./secrets.js');

// Establish database connection
const mongoDb = `mongodb+srv://user_01:${secrets.mongoPassword}@cluster0.spszj.mongodb.net/database_01?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Import routes
const router = require('./routes/routes.js');

// Define app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
  },
  function(req, username, password, done) {
    console.log('localstrategy fires');
    User.findOne({ email: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect username" });
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return done(err);
        if (res) return done(null, user); // passwords match - log user in
        else return done(null, false, { message: "Incorrect password" }) // passwords do not match
      })
    });
  }
));
passport.serializeUser((user, done) => {
  console.log('serializeUser fires');
  done(null, user.id)
});
passport.deserializeUser((id, done) => {
  console.log('deserializeUser fires');
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
app.use(session({ secret: secrets.expressSessionSecret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, done) => {
  res.locals.currentUser = req.user;
  done();
});

//

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
