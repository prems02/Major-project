const Listing = require("../models/listing");

module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        req.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res) => {
    const data = req.body.listing;

// ✅ Fix image format only if needed
if (typeof data.image === "string") {
    data.image = {
        url: data.image,
        filename: ""
    };
}

const newListing = new Listing(data);
newListing.owner = req.user._id;
await newListing.save();
};

module.exports.renderEditForm = async(req,res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListings = async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing;

// ✅ Fix image format only if needed
if (typeof data.image === "string") {
    data.image = {
        url: data.image,
        filename: ""
    };
}

await Listing.findByIdAndUpdate(id, data);
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
};