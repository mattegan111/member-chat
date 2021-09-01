const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('./models/user');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const secrets = require('./secrets.js');
const router = require('./routes/routes.js');


const mongoDb = `mongodb+srv://user_01:${secrets.mongoPassword}@cluster0.spszj.mongodb.net/database_01?retryWrites=true&w=majority`;


mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));


const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

// Middleware
app.use(session({ secret: secrets.expressSessionSecret, resave: false, saveUninitialized: true }));
passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match - log user in
          return done(null, user)
        } else {
          // passwords do not match
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, done) => {
  res.locals.currentUser = req.user;
  done();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); //potentially not needed
app.use(express.json()); //potentially not needed
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser()); //potentially not needed
app.use(express.static(path.join(__dirname, 'public')));

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
