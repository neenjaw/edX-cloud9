const express = require('express'),
      app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

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
