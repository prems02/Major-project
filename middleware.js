const Listing = require("./models/listing");

const ExpressError = require("./utils/ExpressError.js");



module.exports.isLoggedIn = (req , res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl = (req,res,next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async( req,res,next) => {
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    // Check if the image is passed as a string and convert it to the required object format
    if (typeof req.body.listing.image === 'string') {
        req.body.listing.image = {
            url: req.body.listing.image,  // Use the image URL from the form input
            filename: ""  // default filename, or you can set a filename if needed
        };
    }

    // Validate the listing data
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req ,res , next) => {
    let {error} = reviewSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

};
