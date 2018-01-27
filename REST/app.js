const express = require("express"),
      app = express(),
      mongoose = require("mongoose");

//
// mongoose setup
//

mongoose.connect('mongodb://localhost/blog')

//
// mongoose schema setup
//

const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//
// express setup
//

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

//
// express middleware
//

// INDEX REDIRECT
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// INDEX
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log("An error occured.");
    } else {
      res.render("index", { blogs });
    }
  });
});

// NEW
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE
app.post("/blogs", (req, res) => {
  let blog = req.body.blog;

  Blog.create(blog, (err, newBlog) => {
    if (err) {
      res.render("new", { blog, error: true, error_msgs: [err] })
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW
app.get("/blogs/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/blogs");
  } else {
    res.send("Show a blog with id of: " + id);
  }
});

// EDIT
app.get("/blogs/:id/edit", (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/blogs");
  } else {
    res.send("show edit for blog with id of: " + id);
  }
});

// UPDATE
app.put("/blogs/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/blogs");
  } else {
    res.send("update blog with id of: " + id);
  }
});

// DELETE
app.delete("/blogs/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/blogs");
  } else {
    res.send("Delete blog with id of: " + id);
  }
});

//
// express listen
//

app.listen(3000, "localhost", () => {
  console.log("Blog server started on localhost:3000");
})
