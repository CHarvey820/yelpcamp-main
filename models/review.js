/**
 * Initialize Mongoose for MongoDB
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * reviewSchema Schema
 *      Represents Review Schema for Campground objects
 */
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);