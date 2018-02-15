const mongoose = require('mongoose');

module.exports = (function() {

  const campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    created: {type: Date, default: Date.now},
    updated: Date
  });

  const Campground = mongoose.model('Campground', campgroundSchema);

  return Campground;

}());
