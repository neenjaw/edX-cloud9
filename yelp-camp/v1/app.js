const express = require("express"),
      app = express(),
      mongoose = require('mongoose');

let campgrounds = [
  {
    name: 'Little Shovel',
    image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"
  },
  {
    name: 'Tekkara',
    image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"
  },
  {
    name: 'Snow Bowl',
    image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"
  },
  {
    name: 'Signal',
    image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg"
  }
];

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {pageName:"home"});
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", {pageName:"campgrounds", campgrounds});
});

app.post("/campgrounds", (req, res) => {
  let name = req.body.name,
      image = req.body.image;

  if (name && image) {
    campgrounds.push({name, image});
  }

  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new", {pageName: "new"});
});

app.listen(3000, "localhost", () => {
  console.log("Yelp-Camp Server starting on localhost:3000")
})
