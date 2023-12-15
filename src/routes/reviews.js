const express = require('express')
const router = express.Router({ mergeParams: true })
const reviewController = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post(
  '/',
  validateReview,
  isLoggedIn,
  catchAsync(reviewController.createReview)
)

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewController.deleteReview)
)

module.exports = router
