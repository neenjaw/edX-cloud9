const express = require('express'),
      app = express();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/fellinlovewith/:thing", (req, res) => {
  let thing = req.params.thing;

  res.render("fellinlove.ejs", {thing});
});

app.listen(3000, "localhost", () => {
  console.log("Server is listening on port 3000, ctrl+c to exit.");
});
