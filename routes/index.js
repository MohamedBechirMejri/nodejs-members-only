const express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});
router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Signup" });
});
router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login" });
});
// router.get("/logout", (req, res, next) => {
//   res.render("index", { title: "Express" });
// });

module.exports = router;
