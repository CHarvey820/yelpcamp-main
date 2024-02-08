const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundsController = require('../controllers/campgroundsController.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../utils/middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

/**
 * All campgrounds; POST new campground
 */
router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundsController.createCampground))

/**
 * New Campground page
 */
router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

/**
 * Show Single Campground; PUT to update edited campground, Delete Campground
 */
router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

/**
 * Edit campground
 */
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm));

module.exports = router;