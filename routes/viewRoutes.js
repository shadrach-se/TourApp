const express = require("express");
const {
  getOverview,
  getTour,
  getLogin,
  getMe,
} = require("../controllers/viewControllers");

const {
  isLoggedIn,
  verifyLoggedIn,
  logout,
} = require("../controllers/authControllers");
const router = express.Router();

router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLogin);
router.get("/logout", verifyLoggedIn, logout);
router.get("/me", verifyLoggedIn, getMe);

module.exports = router;
