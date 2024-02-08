const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken});

/** Controller file for campgrounds methods */

/** render campgrounds index */
module.exports.index = async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render('campgrounds/index', { campgrounds });
}

/** render new campground form */
module.exports.renderNewForm = (request, response) => {
    response.render('campgrounds/new');
}

/** create a new campground in DB */
module.exports.createCampground = async (request, response) => {
   const geoData = await geoCoder.forwardGeocode({
        query: request.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(request.body.campground);
    campground.geometry = (geoData.body.features[0].geometry);
    campground.images =  request.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = request.user._id;
    await campground.save();
    console.log(campground);
    request.flash('success', 'Successfully made a new campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}

/** show campground page */
module.exports.showCampground = async (request, response) => {
    const campground = await Campground.findById(request.params.id).populate({path:'reviews', populate: { path: 'author'}}).populate('author');
    if (!campground) {
        request.flash('error', 'Cannot find campground; it may have been deleted.');
        return response.redirect('/campgrounds');
    }
    response.render('campgrounds/show', { campground });
}

/** render edit campground form */
module.exports.renderEditForm = async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    response.render('campgrounds/edit', { campground });
}

/** update campground in DB, check for deleted images and remove from backend */
module.exports.updateCampground = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...request.body.campground });
    const imgs = request.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (request.body.deleteImages){
        for(let filename of request.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
   await campground.updateOne({$pull: { images: { filename: { $in: request.body.deleteImages}}}});
    }
    request.flash('success', 'Successfully updated campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}

/** delete campground from DB */
module.exports.deleteCampground = async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    request.flash('success', 'Successfully deleted campground.');
    response.redirect('/campgrounds');
}