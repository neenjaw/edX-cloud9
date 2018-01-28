const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/blog_demo");

// post

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// user
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema]
});

const User = mongoose.model("User", userSchema);

// ------------------------

let newUser = new User({
  email: "patti@brown.edu",
  name: "Patti Brown"
});

//this is a regular Array.push() method
newUser.posts.push({
  title: "How to kick a football",
  content: "Step 1, find a reliable person to hold it still!"
});

newUser.save((err, user) => {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});

// let newPost = new Post({
//   title: "Reflections of Apples",
//   content: "They are delicious"
// });
//
// newPost.save((err, post) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });
