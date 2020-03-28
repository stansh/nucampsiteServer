const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));// User.authenticate() verifies the req username and password against usernames and passwords in the database
passport.serializeUser(User.serializeUser()); // converts user data from req object to be able to be stored
passport.deserializeUser(User.deserializeUser());