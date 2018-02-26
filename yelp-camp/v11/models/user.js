const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports = (function () {
  
    const userSchema = mongoose.Schema({
        username: String,
        password: String,
        displayName: { type: String, unique: true, required: true },
        campgrounds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Campground'
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        created: {
            type: Date, default: Date.now
        },
        updated: Date,
        isAdmin: { type: Boolean, default: false }
    });

    userSchema.plugin(passportLocalMongoose);

    const User = mongoose.model('User', userSchema);

    return User;
}());