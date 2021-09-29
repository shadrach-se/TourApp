const express = require("express");
const {
  signUpUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  verifyLoggedIn,
  restrictTo,
} = require("../controllers/authControllers");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require("../controllers/userControllers");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);

router.post("/forgotPassword", forgotPassword);

router.patch("/resetPassword/:token", resetPassword);

router.use(verifyLoggedIn);

router.get("/me", getMe);

router.patch("/updateMyPassword", updateMyPassword);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
