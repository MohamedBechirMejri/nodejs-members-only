/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("../auth/passport");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      membership: "free",
    });
    user.save(err => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/");
  else res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
