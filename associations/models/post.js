const mongoose = require('mongoose');

module.exports = (function() {

  const postSchema = new mongoose.Schema({
    title: String,
    content: String
  });

  const Post = mongoose.model("Post", postSchema);

  return Post;

}());
