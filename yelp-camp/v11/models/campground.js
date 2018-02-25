const mongoose = require('mongoose');

module.exports = (function() {

    const campgroundSchema = mongoose.Schema({
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        priceInCents: { type: Number, required: true },
        location: String,
        lat: Number,
        lng: Number,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
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
