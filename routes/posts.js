const express = require("express");

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

router.post("/new", (req, res, next) => {
  res.redirect("/");
});

router.get("/:id/delete", (req, res, next) => {
  res.redirect("/");
});

router.post("/:id/delete", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
