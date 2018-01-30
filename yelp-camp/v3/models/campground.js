const mongoose = require('mongoose');

module.exports = (function() {

  const campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
  });

  const Campground = mongoose.model("Campground", campgroundSchema);

  return Campground;

}());
