const mongoose = require('mongoose');

module.exports = (function() {

  const commentSchema = mongoose.Schema({
    text: String,
    author: String,
    created: {type: Date, default: Date.now},
    updated: Date
  });

  const Comment = mongoose.model('Comment', commentSchema);

  return Comment;

}());
