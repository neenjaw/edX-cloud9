const mongoose = require('mongoose');

module.exports = (function() {

  const commentSchema = mongoose.Schema({
    text: String,
    author: String,
  });

  const Comment = mongoose.model("Comment", commentSchema);

  return Comment;

}());
