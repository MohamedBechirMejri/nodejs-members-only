/* eslint-disable consistent-return */
const express = require("express");
const { body, validationResult } = require("express-validator");

const Post = require("../models/Post");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.render("posts/index", { title: "Home" });
});

router.get("/new", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("posts/new", { title: "New Post" });
  } else {
    res.redirect("/signup");
  }
});

router.post("/new", [
  body("title", "Title is required").trim().escape().not().isEmpty(),
  body("content", "Body is required").trim().escape().not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("posts/new", {
        errors: errors.array(),
        data: req.body,
      });
    }
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
    });
    post.save(err => {
      if (err) return next(err);
      res.redirect("/posts");
    });
  },
]);

router.get("/:id/delete", (req, res, next) => {
  res.redirect("/");
});

router.post("/:id/delete", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
