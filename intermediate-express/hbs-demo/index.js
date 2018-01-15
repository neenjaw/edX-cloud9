const express = require('express'),
      hbs = require('express-hbs'),
      path = require('path'),
      app = express();

app.use(express.static("public"));

// set the view engine
app.set('view engine', 'hbs');

// configure the view engine
app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/main.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));

// configure views path
app.set('views', path.join(__dirname,'/views'));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fellinlovewith/:thing", (req, res) => {
  let thing = req.params.thing;

  res.render("fellinlove", {thing});
});

app.get("/posts", (req, res) => {
  let posts = [
    {title: "1", author:"Susie"},
    {title: "2", author:"George"},
    {title: "3", author:"Barry"}
  ];

  res.render("posts", {posts});
});

app.listen(3000, "localhost", () => {
  console.log("Server is listening on port 3000, ctrl+c to exit.");
});
