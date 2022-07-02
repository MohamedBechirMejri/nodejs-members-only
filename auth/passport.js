/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (!user) return done(null, false, { message: "Incorrect username" });
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return done(err);
        if (!res) return done(null, false, { message: "Incorrect password" });
      });
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
