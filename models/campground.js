/**
 * Campground object
 */

/**
 * Initialize Mongoose for MongoDB
 */
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

/**
 * ImageSchema to represent image, used for virtual thumbnail property
 */
const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

/**
 * CampgroundSchema Schema
 *      Represents Schema for Campground objects
 */
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'] ,
        },
        coordinates: {
            type: [Number],

        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

/**
 * Delete all reviews from Campground & database when Campground is deleted
 */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>
    <p>${this.description.substring(0,25)}...</p>`
 })

module.exports = mongoose.model('Campground', CampgroundSchema);