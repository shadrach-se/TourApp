const express = require("express");
const router = express.Router();
const reviewsRouter = require("./reviewRoutes");
const {
  verifyLoggedIn,
  restrictTo,
} = require("../controllers/authControllers");
const {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  cheapTours,
  getTourStats,
  getMonthlyPlan,
} = require("./../controllers/tourControllers");

router.use("/:tourId/reviews", reviewsRouter);

router.route("/top-5-cheap").get(cheapTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router
  .route("/")
  .get(getAllTours)
  .post(verifyLoggedIn, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(verifyLoggedIn, restrictTo("admin", "lead-guide"), updateTour)
  .delete(verifyLoggedIn, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
