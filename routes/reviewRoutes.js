const express = require('express');
const {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewControllers');
const {
  verifyLoggedIn,
  restrictTo,
} = require('../controllers/authControllers');
const router = express.Router({ mergeParams: true });
router.use(verifyLoggedIn);
router
  .route('/')
  .get(getAllReviews)
  .post(verifyLoggedIn, restrictTo('user'), createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);
module.exports = router;
