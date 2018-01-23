const express = require("express"),
      app = express(),
      mongoose = require('mongoose');

//
// mongoose setup
//

mongoose.connect('mongodb://localhost/yelpcamp');

//
// mongoose schema setup
//

const campgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

//
// express setup
//

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//
// express middleware
//

app.get("/", (req, res) => {
  res.render("home", {pageName:"home"});
}); // end app.get /


//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {

  //get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", {pageName:"campgrounds", campgrounds});
    }
  });

}); // end app.get / campgrounds

//CREATE - add new campground
app.post("/campgrounds", (req, res) => {
  let name = req.body.name,
      image = req.body.image,
      description = req.body.description;

  if (name && image) {

    Campground.create({ name, image, description }, (err, campground) => {
      if (err) {
        //TODO: eventually replace with a redirect to the form with error
        console.log(err);
      } else {
        console.log("New Campground created");
        console.log(campground);

        res.redirect("/campgrounds");
      }
    });

  }
}); // end app.post / campgrounds

//NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("new", {pageName: "new"});
}); // end app.get / campgrounds/new

//SHOW - show a campground's detail
app.get("/campgrounds/:id", (req, res) => {
  let id = req.params.id;

  console.log("> Looking for campground: " + id);

  Campground.findById(id, (err, campground) => {
    if (err) {
      //TODO: eventually replace with a redirect to the form with error
      console.log(err);
    } else {
      console.log("> Found:");
      console.log(campground);
      res.render("campground", {pageName: "showCampground", campground});
    }
  });

});

app.listen(3000, "localhost", () => {
  console.log("Yelp-Camp Server starting on localhost:3000")
})
