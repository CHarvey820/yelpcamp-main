const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviewsController = require('../controllers/reviewsController.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware.js');

/**
 * POST new Review 
 */
router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

/**
 * Delete Campground Review
 */
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;