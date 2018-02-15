const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports = (function () {
  
    const userSchema = mongoose.Schema({
        username: String,
        password: String,
        displayName: String,
        created: {
            type: Date, default: Date.now
        },
        updated: Date
    });

    userSchema.plugin(passportLocalMongoose);

    const User = mongoose.model('User', userSchema);

    return User;
}());