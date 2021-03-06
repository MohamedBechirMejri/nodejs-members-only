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
  // else res.render("index", { title: "Home" });
  else res.redirect("/posts");
});

router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/");
  else res.render("signup");
});

router.post("/signup", [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .trim()
    .escape(),
  body("email").isEmail().trim().escape(),
  body("email")
    .custom(value =>
      User.findOne({ email: value }).then(user => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("Email already exists");
        }
      })
    )
    .trim()
    .escape(),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
    .trim()
    .escape(),

  (req, res, next) => {
    if (req.isAuthenticated()) res.redirect("/");
    else {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        res.render("signup", {
          errors: errors.array(),
        });
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
    }
  },
]);

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/");
  else res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        info,
        data: req.body,
      });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

router.get("/membership", (req, res, next) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  else if (req.user.membership === "admin") {
    res.redirect("/");
  } else res.render("membership", { title: "Membership", user: req.user });
});

router.post("/membership", [
  body("secretCode", "secretCode is invalid")
    .trim()
    .escape()
    .if((membership, { req }) => req.body.membership === "admin")
    .equals(process.env.ADMIN_SECRET_CODE),
  body("membership", "Membership must be admin or premium")
    .trim()
    .escape()
    .isIn(["admin", "premium"]),
  (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect("/login");
    const errors = validationResult(req);
    if (!errors.isEmpty())
      res.render("membership", {
        title: "Membership",
        user: req.user,
        errors: errors.array(),
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
  },
]);

module.exports = router;
