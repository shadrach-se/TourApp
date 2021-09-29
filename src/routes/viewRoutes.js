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

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLogin);
router.get("/logout", verifyLoggedIn, logout);
router.get("/me", verifyLoggedIn, getMe);

module.exports = router;
