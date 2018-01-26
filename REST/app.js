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

//
// express setup
//

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

//
// express middleware
//

app.get("/", (req, res) => {
  res.render("home");
}); // end app.get /

//
// express listen
//

app.listen(3000, "localhost", () => {
  console.log("Blog server started on localhost:3000");
})
