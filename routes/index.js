/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */

const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const passport = require("../auth/passport");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/posts");
  else res.render("index", { title: "Home" });
});

router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/");
  else res.render("signup");
});

router.post("/signup", (req, res, next) => {
  if (req.isAuthenticated()) res.redirect("/");
  else
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

router.post("/login", [
  body("email", "Email is required").trim().escape().isEmail(),
  body("password", "Password must be longer than 8 Characters")
    .trim()
    .escape()
    .isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        errors: errors.array(),
        data: req.body,
      });
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
]);

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

router.get("/membership", (req, res, next) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  else res.render("membership", { title: "Membership", user: req.user });
});

router.post("/membership", (req, res, next) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  if (
    req.body.secretCode !== process.env.ADMIN_SECRET_CODE
    // ||req.body.secretCode !== process.env.PREMIUM_SECRET_CODE
  )
    res.render("membership", {
      title: "Membership",
      user: req.user,
      error: "Invalid Secret Code",
    });
  else
    User.findById(req.user._id, (err, user) => {
      if (err) return next(err);
      user.membership = req.body.membership;
      user.save(err => {
        if (err) return next(err);
        res.redirect("/");
      });
    });
});

module.exports = router;
