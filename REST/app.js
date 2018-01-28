const express = require("express"),
      app = express(),
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
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
  created: {type: Date, default: Date.now},
  updated: Date
});

const Blog = mongoose.model("Blog", blogSchema);

//
// express setup
//

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// options for express' body parser
app.use(express.urlencoded({extended: true}));

// sanitize the incoming body
app.use(expressSanitizer());

//declare the static deliverables route
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

  blog.body = req.sanitize(blog.body)

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
    Blog.findOne({ _id: id }, (err, foundBlog) => {
      if (err) {
        res.redirect("/blogs");
      } else {
        res.render("show", { blog: foundBlog });
      }
    });
  }
});

// EDIT
app.get("/blogs/:id/edit", (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/blogs");
  } else {
    Blog.findOne({ _id: id }, (err, foundBlog) => {
      if (err) {
        res.redirect("/blogs");
      } else {
        res.render("edit", { blog: foundBlog });
      }
    });
  }
});

// UPDATE
app.put("/blogs/:id", (req, res) => {
  let id = req.params.id,
      blog = req.body.blog;

  blog.updated = Date.now();

  blog.body = req.sanitize(blog.body)

  if (!id) {
    res.redirect("/blogs");
  } else {
    Blog.where({ _id: id }).update({ $set: blog }, (err, updatedBlog) => {
      if (err) {
        console.log(err);
        res.redirect(`/blogs/${id}/edit`);
      } else {
        res.redirect(`/blogs/${id}`);
      }
    })
  }
});

// DELETE
app.delete("/blogs/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/blogs");
  } else {
    Blog.where({ _id: id }).remove((err) => {
      if (err) {
        console.log(err);
        res.redirect("/blogs");
      } else {
        console.log(id + " deleted.");
        res.redirect("/blogs");
      }
    });
  }
});

//
// express listen
//

app.listen(3000, "localhost", () => {
  console.log("Blog server started on localhost:3000");
})
