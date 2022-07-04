/* eslint-disable consistent-return */
const express = require("express");
const { body, validationResult } = require("express-validator");

const Post = require("../models/Post");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  Post.find({}, (err, posts) => {
    if (err) return next(err);
    res.render("posts/index", { posts, user: req.user });
  }).populate("user");
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
  body("content", "Body is required").trim().not().isEmpty(),
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
      user: req.user.id,
    });
    post.save(err => {
      if (err) return next(err);
      res.redirect("/posts");
    });
  },
]);

router.get("/:id/delete", (req, res, next) => {
  if (req.isAuthenticated())
    if (req.user.membership === "admin")
      res.render("posts/delete", { title: "Delete Post" });
    else res.redirect("/membership");
  else res.redirect("/signup");
});

router.post("/:id/delete", (req, res, next) => {
  if (req.isAuthenticated())
    if (req.user.membership === "admin") {
      Post.findByIdAndDelete(req.params.id, err => {
        if (err) return next(err);
        res.redirect("/posts");
      });
    } else res.redirect("/membership");
  else res.redirect("/signup");
});

module.exports = router;
