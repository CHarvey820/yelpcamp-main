const ExpressError = require('../utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const Review = require("../models/review");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to access this feature.');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (request, response, next) => {
    const { error } = Campground.validate(request.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
module.exports.isAuthor = async(request, response, next) => {
    const { id } = request.params;
    const campground = await Campground.findById(id);
    if (!(campground.author.equals(request.user._id))) {
        request.flash('error', "You do not have permissions for this action.");
       return response.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.validateReview = (request, response, next) => {

    const { error } = Review.validate(request.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(request, response, next) => {
    const { id, reviewId } = request.params;
    const review = await Review.findById(reviewId);
    if (!(review.author.equals(request.user._id))) {
        request.flash('error', "You do not have permissions for this action.");
       return response.redirect(`/campgrounds/${id}`);
    }
    next();
}

