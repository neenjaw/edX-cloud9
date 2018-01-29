const mongoose = require('mongoose');

module.exports = (function() {

  const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  });

  const User = mongoose.model("User", userSchema);

  return User;

}());
