const mongoose = require('mongoose'),
      Post = require("./models/post"),
      User = require("./models/user");

mongoose.connect("mongodb://localhost/blog_demo_2");

// Post.create({
//   title: "Check it out, I'm modularized!",
//   content: "Blah blah blah blah blah blah blah blah."
// }, (err, post) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });


// User.create({
//   email: "patti@brown.edu",
//   name: "Patti Brown"
// });

// Post.create({
//   title: "BURGERS BURGERS BURGERS!",
//   content: "lorem ipsum yadda yadda yadda"
// }, (err, post) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//     User.findOne({email:"patti@brown.edu"}, (err, foundUser) => {
//       if (err) {
//         console.log(err);
//       } else {
//         foundUser.posts.push(post._id);
//         foundUser.save(function(err, data) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log(data);
//           }
//         });
//       }
//     })
//   }
// });

// Find user
// Find all posts

// User
//   .findOne({email: "patti@brown.edu"})
//   .populate("posts")
//   .exec((err, user) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(user);
//     }
//   });

// ------------------------

//
// //this is a regular Array.push() method
// newUser.posts.push({
//   title: "How to kick a football",
//   content: "Step 1, find a reliable person to hold it still!"
// });
//
// newUser.save((err, user) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

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
