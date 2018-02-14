const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports = (function() {

  const userSchema = mongoose.Schema({
    username: String,
    password: String
  });

  userSchema.plugin(passportLocalMongoose);

  const User = mongoose.model('User', userSchema);

  return User;
}());